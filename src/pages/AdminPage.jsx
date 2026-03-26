import { useEffect, useRef, useState } from 'react';
import { adminAuth, api } from '../api/client';
import { Bell, Image as ImageIcon, MessageSquareWarning, Store, Phone } from 'lucide-react';

const MAX_IMAGE_SIZE = 5 * 1024 * 1024;

export default function AdminPage() {
  const sections = {
    announcements: 'announcements',
    contacts: 'contacts',
    images: 'images',
    complaints: 'complaints',
    shops: 'shops'
  };

  const [credentials, setCredentials] = useState({ username: '', password: '' });
  const [token, setToken] = useState(adminAuth.getToken());
  const [activeSection, setActiveSection] = useState(sections.announcements);
  const [announcement, setAnnouncement] = useState({ title: '', details: '', dateLabel: '' });
  const [contact, setContact] = useState({ name: '', role: '', phone: '' });
  const [shop, setShop] = useState({ shopName: '', ownerName: '', phone: '', category: '' });
  const [gallery, setGallery] = useState({ title: '', category: '' });
  const [galleryFile, setGalleryFile] = useState(null);
  const fileInputRef = useRef(null);
  const [message, setMessage] = useState('');
  const [formError, setFormError] = useState('');
  const [galleryItems, setGalleryItems] = useState([]);
  const [contacts, setContacts] = useState([]);
  const [shops, setShops] = useState([]);
  const [complaints, setComplaints] = useState([]);
  const [pendingDeleteImage, setPendingDeleteImage] = useState(null);
  const [editingContactId, setEditingContactId] = useState(null);
  const [editContact, setEditContact] = useState({ name: '', role: '', phone: '' });

  const loadGalleryItems = async () => {
    try {
      const images = await api.getGalleryImages();
      setGalleryItems(images);
    } catch {
      setGalleryItems([]);
    }
  };

  const loadComplaints = async () => {
    try {
      const complaintItems = await api.getComplaints();
      setComplaints(complaintItems);
    } catch {
      setComplaints([]);
    }
  };

  const loadContacts = async () => {
    try {
      const contactItems = await api.getContacts();
      setContacts(contactItems);
    } catch {
      setContacts([]);
    }
  };

  const loadShops = async () => {
    try {
      const shopItems = await api.getShops();
      setShops(shopItems);
    } catch {
      setShops([]);
    }
  };

  useEffect(() => {
    if (token) {
      loadContacts();
      loadGalleryItems();
      loadComplaints();
      loadShops();
    }
  }, [token]);

  const login = async (event) => {
    event.preventDefault();
    try {
      const response = await api.loginAdmin(credentials);
      adminAuth.setToken(response.token);
      setToken(response.token);
      setCredentials({ username: '', password: '' });
      setMessage('Admin login successful.');
      setFormError('');
      await loadContacts();
      await loadGalleryItems();
      await loadComplaints();
      await loadShops();
    } catch {
      setMessage('Invalid admin credentials.');
    }
  };

  const logout = () => {
    adminAuth.clearToken();
    setToken('');
    setActiveSection(sections.announcements);
    setMessage('Logged out from admin panel.');
    setFormError('');
    setContacts([]);
    setGalleryItems([]);
    setShops([]);
    setComplaints([]);
    setEditingContactId(null);
  };

  const handleUnauthorized = () => {
    adminAuth.clearToken();
    setToken('');
    setActiveSection(sections.announcements);
    setMessage('');
    setFormError('Session expired. Please login again.');
    setPendingDeleteImage(null);
  };

  const submitAnnouncement = async (event) => {
    event.preventDefault();
    try {
      await api.addAnnouncement(announcement, token);
      setMessage('Announcement added.');
      setFormError('');
      setAnnouncement({ title: '', details: '', dateLabel: '' });
    } catch (error) {
      if (error.status === 401) {
        handleUnauthorized();
        return;
      }
      setMessage('');
      setFormError(error.message || 'Could not save announcement.');
    }
  };

  const submitContact = async (event) => {
    event.preventDefault();
    try {
      await api.addContact(contact, token);
      setMessage('Contact added successfully.');
      setFormError('');
      setContact({ name: '', role: '', phone: '' });
      await loadContacts();
    } catch (error) {
      if (error.status === 401) {
        handleUnauthorized();
        return;
      }
      setMessage('');
      setFormError(error.message || 'Could not add contact.');
    }
  };

  const startEditContact = (item) => {
    setEditingContactId(item.id);
    setEditContact({ name: item.name, role: item.role, phone: item.phone });
  };

  const cancelEditContact = () => {
    setEditingContactId(null);
    setEditContact({ name: '', role: '', phone: '' });
  };

  const saveContactEdit = async (id) => {
    try {
      await api.updateContact(id, editContact, token);
      setMessage('Contact updated successfully.');
      setFormError('');
      cancelEditContact();
      await loadContacts();
    } catch (error) {
      if (error.status === 401) {
        handleUnauthorized();
        return;
      }
      setMessage('');
      setFormError(error.message || 'Could not update contact.');
    }
  };

  const removeContact = async (id) => {
    try {
      await api.deleteContact(id, token);
      setMessage('Contact removed successfully.');
      setFormError('');
      await loadContacts();
    } catch (error) {
      if (error.status === 401) {
        handleUnauthorized();
        return;
      }
      setMessage('');
      setFormError(error.message || 'Could not remove contact.');
    }
  };

  const onGalleryFileChange = (event) => {
    const file = event.target.files?.[0] || null;

    if (!file) {
      setGalleryFile(null);
      setFormError('');
      return;
    }

    if (!file.type.startsWith('image/')) {
      setGalleryFile(null);
      setFormError('Please select a valid image file (JPG, PNG, WEBP).');
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
      return;
    }

    if (file.size > MAX_IMAGE_SIZE) {
      setGalleryFile(null);
      setFormError('Image is too large. Maximum allowed size is 5 MB.');
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
      return;
    }

    setFormError('');
    setGalleryFile(file);
  };

  const submitGallery = async (event) => {
    event.preventDefault();

    if (!galleryFile) {
      setMessage('');
      setFormError('Please choose an image file.');
      return;
    }

    try {
      await api.uploadGalleryImage({ ...gallery, file: galleryFile }, token);
      setMessage('Gallery image added.');
      setFormError('');
      setGallery({ title: '', category: '' });
      setGalleryFile(null);
      await loadGalleryItems();
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    } catch (error) {
      if (error.status === 401) {
        handleUnauthorized();
        return;
      }
      setMessage('');
      setFormError(error.message || 'Could not upload image.');
    }
  };

  const requestDeleteImage = (image) => {
    setPendingDeleteImage(image);
  };

  const submitShop = async (event) => {
    event.preventDefault();
    try {
      await api.addShop(shop, token);
      setMessage('Shop added successfully.');
      setFormError('');
      setShop({ shopName: '', ownerName: '', phone: '', category: '' });
      await loadShops();
    } catch (error) {
      if (error.status === 401) {
        handleUnauthorized();
        return;
      }
      setMessage('');
      setFormError(error.message || 'Could not add shop.');
    }
  };

  const removeShop = async (id) => {
    try {
      await api.deleteShop(id, token);
      setMessage('Shop removed successfully.');
      setFormError('');
      await loadShops();
    } catch (error) {
      if (error.status === 401) {
        handleUnauthorized();
        return;
      }
      setMessage('');
      setFormError(error.message || 'Could not remove shop.');
    }
  };

  const closeDeleteModal = () => {
    setPendingDeleteImage(null);
  };

  const confirmDeleteImage = async () => {
    if (!pendingDeleteImage) {
      return;
    }

    try {
      await api.deleteGalleryImage(pendingDeleteImage.id, token);
      setMessage('Image deleted successfully.');
      setFormError('');
      closeDeleteModal();
      await loadGalleryItems();
    } catch (error) {
      if (error.status === 401) {
        handleUnauthorized();
        return;
      }
      setMessage('');
      setFormError(error.message || 'Could not delete image.');
    }
  };

  const updateComplaintStatus = async (id, status) => {
    try {
      await api.updateComplaintStatus(id, status, token);
      setMessage('Complaint status updated.');
      setFormError('');
      await loadComplaints();
    } catch (error) {
      if (error.status === 401) {
        handleUnauthorized();
        return;
      }
      setMessage('');
      setFormError(error.message || 'Could not update complaint status.');
    }
  };

  const getStatusStyles = (status) => {
    if (status === 'RESOLVED') {
      return 'bg-emerald-100 text-emerald-800';
    }
    if (status === 'IN_PROGRESS') {
      return 'bg-amber-100 text-amber-800';
    }
    return 'bg-slate-100 text-slate-700';
  };

  if (!token) {
    return (
      <div className="space-y-4">
        <section className="card bg-gradient-to-br from-emerald-50 to-white">
          <h1 className="section-title">Admin Login</h1>
          <p className="mt-2 text-sm text-slate-600">Login to manage announcements, images, and complaints.</p>
          {message && <p className="mt-2 text-sm text-leaf">{message}</p>}
        </section>

        <form className="card space-y-3" onSubmit={login}>
          <input
            className="w-full rounded-xl border border-green-300 p-3"
            placeholder="వినియోగదారు పేరు"
            value={credentials.username}
            onChange={(event) => setCredentials((p) => ({ ...p, username: event.target.value }))}
            required
          />
          <input
            type="password"
            className="w-full rounded-xl border border-green-300 p-3"
            placeholder="పాస్‌వర్డ్"
            value={credentials.password}
            onChange={(event) => setCredentials((p) => ({ ...p, password: event.target.value }))}
            required
          />
          <button className="primary-btn w-full" type="submit">Login</button>
          <p className="text-xs text-slate-600">Default: admin / admin123</p>
        </form>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <section className="card bg-gradient-to-br from-emerald-50 to-white">
        <h1 className="section-title">Simple Admin Panel</h1>
        <p className="mt-2 text-sm text-slate-600">Use quick buttons below to manage portal data.</p>
        <button type="button" onClick={logout} className="secondary-btn mt-3 w-full">Logout</button>
        {message && <p className="mt-2 text-sm text-leaf">{message}</p>}
        {formError && <p className="mt-2 text-sm text-red-700">{formError}</p>}
      </section>

      <section className="card sticky top-[78px] z-10">
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-5">
          <button
            type="button"
            onClick={() => setActiveSection(sections.announcements)}
            className={`inline-flex items-center justify-center gap-2 rounded-xl px-3 py-3 text-sm font-bold ${
              activeSection === sections.announcements ? 'bg-leaf text-white shadow-md' : 'bg-green-100 text-leaf'
            }`}
          >
            <Bell size={16} />
            Announcements
          </button>
          <button
            type="button"
            onClick={() => setActiveSection(sections.contacts)}
            className={`inline-flex items-center justify-center gap-2 rounded-xl px-3 py-3 text-sm font-bold ${
              activeSection === sections.contacts ? 'bg-leaf text-white shadow-md' : 'bg-green-100 text-leaf'
            }`}
          >
            <Phone size={16} />
            Contacts
          </button>
          <button
            type="button"
            onClick={() => setActiveSection(sections.images)}
            className={`inline-flex items-center justify-center gap-2 rounded-xl px-3 py-3 text-sm font-bold ${
              activeSection === sections.images ? 'bg-leaf text-white shadow-md' : 'bg-green-100 text-leaf'
            }`}
          >
            <ImageIcon size={16} />
            Images
          </button>
          <button
            type="button"
            onClick={() => setActiveSection(sections.complaints)}
            className={`inline-flex items-center justify-center gap-2 rounded-xl px-3 py-3 text-sm font-bold ${
              activeSection === sections.complaints ? 'bg-leaf text-white shadow-md' : 'bg-green-100 text-leaf'
            }`}
          >
            <MessageSquareWarning size={16} />
            Complaints
          </button>
          <button
            type="button"
            onClick={() => setActiveSection(sections.shops)}
            className={`inline-flex items-center justify-center gap-2 rounded-xl px-3 py-3 text-sm font-bold ${
              activeSection === sections.shops ? 'bg-leaf text-white shadow-md' : 'bg-green-100 text-leaf'
            }`}
          >
            <Store size={16} />
            Shops
          </button>
        </div>
      </section>

      {activeSection === sections.contacts && (
        <>
          <form className="card space-y-3" onSubmit={submitContact}>
            <h2 className="text-lg font-bold text-soil">Add Contact</h2>
            <input
              className="w-full rounded-xl border border-green-300 p-3"
              placeholder="పేరు (తెలుగు/ఆంగ్లం)"
              value={contact.name}
              onChange={(event) => setContact((p) => ({ ...p, name: event.target.value }))}
              required
            />
            <input
              className="w-full rounded-xl border border-green-300 p-3"
              placeholder="పాత్ర (అంబులెన్స్/పోలీస్/పంచాయతీ మొదలైనవి)"
              value={contact.role}
              onChange={(event) => setContact((p) => ({ ...p, role: event.target.value }))}
              required
            />
            <input
              className="w-full rounded-xl border border-green-300 p-3"
              placeholder="ఫోన్ నంబర్"
              value={contact.phone}
              onChange={(event) => setContact((p) => ({ ...p, phone: event.target.value }))}
              required
            />
            <button className="primary-btn w-full" type="submit">Save Contact</button>
          </form>

          <section className="card space-y-3 bg-white">
            <h2 className="text-lg font-bold text-soil">Manage Contacts</h2>
            {contacts.length === 0 && <p className="text-sm text-slate-600">No contacts available.</p>}
            {contacts.map((item) => (
              <article key={item.id} className="rounded-xl border border-green-100 bg-emerald-50/40 p-3">
                {editingContactId === item.id ? (
                  <div className="space-y-2">
                    <input
                      className="w-full rounded-lg border border-green-300 p-2"
                      value={editContact.name}
                      onChange={(event) => setEditContact((p) => ({ ...p, name: event.target.value }))}
                    />
                    <input
                      className="w-full rounded-lg border border-green-300 p-2"
                      value={editContact.role}
                      onChange={(event) => setEditContact((p) => ({ ...p, role: event.target.value }))}
                    />
                    <input
                      className="w-full rounded-lg border border-green-300 p-2"
                      value={editContact.phone}
                      onChange={(event) => setEditContact((p) => ({ ...p, phone: event.target.value }))}
                    />
                    <div className="grid grid-cols-2 gap-2">
                      <button type="button" className="primary-btn w-full" onClick={() => saveContactEdit(item.id)}>
                        Save
                      </button>
                      <button type="button" className="secondary-btn w-full" onClick={cancelEditContact}>
                        Cancel
                      </button>
                    </div>
                  </div>
                ) : (
                  <>
                    <p className="font-semibold text-soil">{item.name}</p>
                    <p className="text-xs text-slate-600">Role: {item.role}</p>
                    <p className="text-xs text-slate-600">Phone: {item.phone}</p>
                    <div className="mt-2 grid grid-cols-2 gap-2">
                      <button
                        type="button"
                        className="rounded-lg bg-amber-600 px-3 py-2 text-sm font-bold text-white"
                        onClick={() => startEditContact(item)}
                      >
                        Edit
                      </button>
                      <button
                        type="button"
                        className="rounded-lg bg-red-600 px-3 py-2 text-sm font-bold text-white"
                        onClick={() => removeContact(item.id)}
                      >
                        Remove
                      </button>
                    </div>
                  </>
                )}
              </article>
            ))}
          </section>
        </>
      )}

      {activeSection === sections.announcements && (
        <form className="card space-y-3" onSubmit={submitAnnouncement}>
          <h2 className="text-lg font-bold text-soil">Add Announcement</h2>
          <input
            className="w-full rounded-xl border border-green-300 p-3"
            placeholder="శీర్షిక"
            value={announcement.title}
            onChange={(event) => setAnnouncement((p) => ({ ...p, title: event.target.value }))}
            required
          />
          <textarea
            className="h-24 w-full rounded-xl border border-green-300 p-3"
            placeholder="వివరాలు"
            value={announcement.details}
            onChange={(event) => setAnnouncement((p) => ({ ...p, details: event.target.value }))}
            required
          />
          <input
            className="w-full rounded-xl border border-green-300 p-3"
            placeholder="తేదీ (YYYY-MM-DD)"
            value={announcement.dateLabel}
            onChange={(event) => setAnnouncement((p) => ({ ...p, dateLabel: event.target.value }))}
            required
          />
          <button className="primary-btn w-full" type="submit">Save Announcement</button>
        </form>
      )}

      {activeSection === sections.images && (
        <>
          <form className="card space-y-3" onSubmit={submitGallery}>
            <h2 className="text-lg font-bold text-soil">Add Gallery Image</h2>
            <input
              className="w-full rounded-xl border border-green-300 p-3"
              placeholder="చిత్ర శీర్షిక"
              value={gallery.title}
              onChange={(event) => setGallery((p) => ({ ...p, title: event.target.value }))}
              required
            />
            <input
              className="w-full rounded-xl border border-green-300 p-3"
              placeholder="వర్గం"
              value={gallery.category}
              onChange={(event) => setGallery((p) => ({ ...p, category: event.target.value }))}
              required
            />
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="w-full rounded-xl border border-green-300 p-3"
              onChange={onGalleryFileChange}
              required
            />
            <p className="text-xs text-slate-600">Accepted: image files only, max size 5 MB.</p>
            <button className="secondary-btn w-full" type="submit">Upload Gallery Image</button>
          </form>

          <section className="card space-y-3 bg-white">
            <h2 className="text-lg font-bold text-soil">Manage Gallery Images</h2>
            {galleryItems.length === 0 && <p className="text-sm text-slate-600">No gallery images found.</p>}
            {galleryItems.map((image) => (
              <article key={image.id} className="rounded-xl border border-green-100 bg-emerald-50/40 p-3">
                <div className="flex items-center justify-between gap-3">
                  <img
                    src={image.thumbnailUrl || image.imageUrl}
                    alt={image.title}
                    className="h-14 w-14 rounded-lg border border-green-100 object-cover"
                    loading="lazy"
                  />
                  <div>
                    <p className="font-semibold text-soil">{image.title}</p>
                    <p className="text-xs text-slate-600">{image.category}</p>
                  </div>
                  <button
                    type="button"
                    className="rounded-lg bg-red-600 px-3 py-2 text-sm font-bold text-white"
                    onClick={() => requestDeleteImage(image)}
                  >
                    Delete
                  </button>
                </div>
              </article>
            ))}
          </section>
        </>
      )}

      {activeSection === sections.complaints && (
        <section className="card space-y-3 bg-white">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-soil">View Complaints</h2>
            <button type="button" className="soft-btn px-3 py-2 text-xs" onClick={loadComplaints}>
              Refresh
            </button>
          </div>
          {complaints.length === 0 && <p className="text-sm text-slate-600">No complaints submitted yet.</p>}
          {complaints.map((item) => (
            <article key={item.id} className="rounded-xl border border-green-100 bg-emerald-50/40 p-3">
              {(() => {
                const status = item.complaintStatus || 'NEW';
                const isResolved = status === 'RESOLVED';
                const isInProgress = status === 'IN_PROGRESS';
                return (
                  <>
              <div className="flex items-center justify-between gap-2">
                <p className="font-semibold text-soil">{item.name}</p>
                <span className={`rounded-full px-2 py-1 text-[11px] font-bold ${getStatusStyles(item.complaintStatus)}`}>
                  {(item.complaintStatus || 'NEW').replace('_', ' ')}
                </span>
              </div>
              <a href={`tel:${item.phone}`} className="text-sm text-leaf underline">{item.phone}</a>
              <p className="mt-2 text-sm text-slate-700">{item.problemDescription}</p>
              <div className="mt-2 grid grid-cols-2 gap-2">
                <button
                  type="button"
                  disabled={isResolved || isInProgress}
                  className={`rounded-lg px-3 py-2 text-sm font-bold text-white ${
                    isResolved || isInProgress ? 'bg-slate-400' : 'bg-amber-600'
                  }`}
                  onClick={() => updateComplaintStatus(item.id, 'IN_PROGRESS')}
                >
                  {isInProgress ? 'In Progress' : 'Mark In Progress'}
                </button>
                <button
                  type="button"
                  disabled={isResolved}
                  className={`rounded-lg px-3 py-2 text-sm font-bold text-white ${
                    isResolved ? 'bg-slate-400' : 'bg-emerald-700'
                  }`}
                  onClick={() => updateComplaintStatus(item.id, 'RESOLVED')}
                >
                  {isResolved ? 'Resolved' : 'Mark Resolved'}
                </button>
              </div>
                  </>
                );
              })()}
            </article>
          ))}
        </section>
      )}

      {activeSection === sections.shops && (
        <>
          <form className="card space-y-3" onSubmit={submitShop}>
            <h2 className="text-lg font-bold text-soil">Add Shop / Service</h2>
            <input
              className="w-full rounded-xl border border-green-300 p-3"
              placeholder="దుకాణం పేరు (తెలుగు/ఆంగ్లం)"
              value={shop.shopName}
              onChange={(event) => setShop((p) => ({ ...p, shopName: event.target.value }))}
              required
            />
            <input
              className="w-full rounded-xl border border-green-300 p-3"
              placeholder="యజమాని పేరు (తెలుగు/ఆంగ్లం)"
              value={shop.ownerName}
              onChange={(event) => setShop((p) => ({ ...p, ownerName: event.target.value }))}
              required
            />
            <input
              className="w-full rounded-xl border border-green-300 p-3"
              placeholder="ఫోన్ నంబర్"
              value={shop.phone}
              onChange={(event) => setShop((p) => ({ ...p, phone: event.target.value }))}
              required
            />
            <input
              className="w-full rounded-xl border border-green-300 p-3"
              placeholder="వర్గం (ఉదా: కిరాణా, డెయిరీ)"
              value={shop.category}
              onChange={(event) => setShop((p) => ({ ...p, category: event.target.value }))}
              required
            />
            <button className="primary-btn w-full" type="submit">Save Shop</button>
          </form>

          <section className="card space-y-3 bg-white">
            <h2 className="text-lg font-bold text-soil">Manage Shops</h2>
            {shops.length === 0 && <p className="text-sm text-slate-600">No shops added yet.</p>}
            {shops.map((item) => (
              <article key={item.id} className="rounded-xl border border-green-100 bg-emerald-50/40 p-3">
                <p className="font-semibold text-soil">{item.shopName}</p>
                <p className="text-xs text-slate-600">Owner: {item.ownerName}</p>
                <p className="text-xs text-slate-600">Phone: {item.phone}</p>
                <p className="text-xs text-slate-600">Category: {item.category}</p>
                <button
                  type="button"
                  className="mt-2 rounded-lg bg-red-600 px-3 py-2 text-sm font-bold text-white"
                  onClick={() => removeShop(item.id)}
                >
                  Remove
                </button>
              </article>
            ))}
          </section>
        </>
      )}

      {pendingDeleteImage && (
        <div className="fixed inset-0 z-40 flex items-end justify-center bg-black/45 p-4 sm:items-center">
          <div className="w-full max-w-sm rounded-2xl bg-white p-4 shadow-card">
            <h3 className="text-lg font-bold text-soil">Confirm Delete</h3>
            <p className="mt-2 text-sm text-slate-700">
              Delete image "{pendingDeleteImage.title}"? This action cannot be undone.
            </p>
            <div className="mt-4 grid grid-cols-2 gap-2">
              <button type="button" className="secondary-btn w-full" onClick={closeDeleteModal}>
                Cancel
              </button>
              <button
                type="button"
                className="w-full rounded-xl bg-red-600 px-4 py-3 text-white font-semibold"
                onClick={confirmDeleteImage}
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
