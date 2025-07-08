'use client';

import { useState, useEffect } from 'react';
import { PhotoUpload } from 'app/components/PhotoUpload';
import Image from 'next/image';
import LoadingAlbums from './LoadingAlbums';

import bg from '../../public/bg.jpg';

interface Album {
  id: number;
  title: string;
  description?: string;
  createdAt: string;
}

interface Photo {
  id: number;
  caption?: string;
  createdAt: string;
}

interface EditAlbumModalProps {
  album: Album;
  onClose: () => void;
  onSave: (album: Album) => Promise<void>;
}

function EditAlbumModal({ album, onClose, onSave }: EditAlbumModalProps) {
  const [title, setTitle] = useState(album.title);
  const [description, setDescription] = useState(album.description || '');

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    await onSave({ ...album, title, description });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md shadow-lg">
        <h2 className="text-xl font-semibold mb-4">Edit Album</h2>
        <form onSubmit={handleSubmit}>
          <input
            className="w-full p-2 border rounded mb-2"
            value={title}
            onChange={e => setTitle(e.target.value)}
            placeholder="Album title"
            required
          />
          <textarea
            className="w-full p-2 border rounded mb-2"
            value={description}
            onChange={e => setDescription(e.target.value)}
            placeholder="Album description"
            rows={3}
          />
          <div className="flex gap-2 justify-end">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded bg-gray-300 hover:bg-gray-400"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700"
            >
              Save
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// PhotoModal component for viewing and flipping through photos
function PhotoModal({ photos, currentIndex, onClose, onPrev, onNext }: {
  photos: Photo[];
  currentIndex: number;
  onClose: () => void;
  onPrev: () => void;
  onNext: () => void;
}) {
  if (currentIndex < 0 || currentIndex >= photos.length) return null;
  const photo = photos[currentIndex];
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-80">
      <button
        className="absolute top-4 right-4 text-white text-2xl font-bold bg-black bg-opacity-40 rounded-full w-10 h-10 flex items-center justify-center hover:bg-opacity-70"
        onClick={onClose}
        aria-label="Close"
      >
        <span className="flex items-center justify-center w-full h-full">×</span>
      </button>
      <button
        className="absolute left-4 top-1/2 -translate-y-1/2 text-white text-3xl font-bold bg-black bg-opacity-40 rounded-full w-10 h-10 flex items-center justify-center hover:bg-opacity-70"
        onClick={onPrev}
        aria-label="Previous"
        disabled={photos.length <= 1}
      >
        <span className="flex items-center justify-center w-full h-full">‹</span>
      </button>
      <div className="max-w-3xl max-h-[80vh] flex flex-col items-center">
        <Image
          src={`/api/photos/${photo.id}/data`}
          alt={photo.caption || 'Photo'}
          width={800}
          height={600}
          className="object-contain max-h-[70vh] max-w-full rounded shadow-lg"
        />
        {photo.caption && (
          <div className="mt-4 text-white text-center text-lg bg-black bg-opacity-40 px-4 py-2 rounded">
            {photo.caption}
          </div>
        )}
      </div>
      <button
        className="absolute right-4 top-1/2 -translate-y-1/2 text-white text-3xl font-bold bg-black bg-opacity-40 rounded-full w-10 h-10 flex items-center justify-center hover:bg-opacity-70"
        onClick={onNext}
        aria-label="Next"
        disabled={photos.length <= 1}
      >
        <span className="flex items-center justify-center w-full h-full">›</span>
      </button>
    </div>
  );
}

export default function GalleryClient({ user }: { user: { id: string, email: string, name: string } | null }) {
  const userId = user?.id;
  const [albums, setAlbums] = useState<Album[]>([]);
  const [selectedAlbum, setSelectedAlbum] = useState<Album | null>(null);
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [newAlbumTitle, setNewAlbumTitle] = useState('');
  const [newAlbumDescription, setNewAlbumDescription] = useState('');
  const [isCreatingAlbum, setIsCreatingAlbum] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [openMenuAlbumId, setOpenMenuAlbumId] = useState<number | null>(null);
  const [editingAlbum, setEditingAlbum] = useState<Album | null>(null);
  const [modalPhotoIndex, setModalPhotoIndex] = useState<number | null>(null);

  useEffect(() => {
    if (!userId) return;
    setLoading(true);
    setError(null);
    fetch(`/api/albums?userId=${userId}`)
      .then(res => res.json())
      .then(data => setAlbums(data.albums || []))
      .catch(() => setError('Failed to load albums'))
      .finally(() => setLoading(false));
  }, [userId]);

  useEffect(() => {
    if (!selectedAlbum) {
      setPhotos([]);
      return;
    }
    fetch(`/api/photos?albumId=${selectedAlbum.id}`)
      .then(res => res.json())
      .then(data => setPhotos(data.photos || []));
  }, [selectedAlbum]);

  const createAlbum = async () => {
    if (!newAlbumTitle.trim()) return;

    try {
      const response = await fetch('/api/albums', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId,
          title: newAlbumTitle,
          description: newAlbumDescription,
        }),
      });

      if (response.ok) {
        const result = await response.json();
        setAlbums([...albums, result.album]);
        setNewAlbumTitle('');
        setNewAlbumDescription('');
        setIsCreatingAlbum(false);
      }
    } catch (error) {
      console.error('Error creating album:', error);
    }
  };

  const handlePhotoUpload = async (photoId: number) => {
    if (!selectedAlbum) return;
    // Fetch the new photo from the API and add it to the state
    try {
      const res = await fetch(`/api/photos?photoId=${photoId}`);
      if (res.ok) {
        const data = await res.json();
        if (data.photo) {
          setPhotos([...photos, data.photo]);
        }
      }
    } catch (error) {
      console.error('Error fetching new photo:', error);
    }
  };

  const handleUploadError = (error: string) => {
    alert(`Upload error: ${error}`);
  };

  const handleDeletePhoto = async (photoId: number) => {
    // if (!window.confirm('Are you sure you want to delete this photo?')) return;
    const res = await fetch(`/api/photos?photoId=${photoId}`, { method: 'DELETE' });
    if (res.ok) {
      setPhotos((prev) => prev.filter((p) => p.id !== photoId));
    } else {
      alert('Failed to delete photo');
    }
  };

  const handleEditAlbum = (album: Album) => {
    setEditingAlbum(album);
    setOpenMenuAlbumId(null);
  };

  const handleSaveAlbum = async (updatedAlbum: Album) => {
    const res = await fetch(`/api/albums?albumId=${updatedAlbum.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title: updatedAlbum.title, description: updatedAlbum.description }),
    });
    if (res.ok) {
      setAlbums(albums =>
        albums.map(a => (a.id === updatedAlbum.id ? { ...a, ...updatedAlbum } : a))
      );
      setEditingAlbum(null);
    } else {
      alert('Failed to update album');
    }
  };

  const handleDeleteAlbum = async (albumId: number) => {
    if (!window.confirm('Are you sure you want to delete this album?')) return;
    const res = await fetch(`/api/albums?albumId=${albumId}`, { method: 'DELETE' });
    if (res.ok) {
      setAlbums((prev) => prev.filter((a) => a.id !== albumId));
      if (selectedAlbum?.id === albumId) setSelectedAlbum(null);
    } else {
      alert('Failed to delete album');
    }
    setOpenMenuAlbumId(null);
  };

  console.log('photos', photos);
  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Photo Gallery</h1>
        {loading && <LoadingAlbums />}
        {!loading && error && <div className="text-red-500">{error}</div>}
        {/* Albums Section */}
        {!loading && <div className="bg-white rounded-lg shadow p-6 mb-8">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">Albums</h2>
            <button
              onClick={() => setIsCreatingAlbum(true)}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
            >
              Create Album
            </button>
          </div>

          {isCreatingAlbum && (
            <div className="mb-4 p-4 border rounded-lg">
              <input
                type="text"
                placeholder="Album title"
                value={newAlbumTitle}
                onChange={(e) => setNewAlbumTitle(e.target.value)}
                className="w-full p-2 border rounded mb-2"
              />
              <textarea
                placeholder="Album description (optional)"
                value={newAlbumDescription}
                onChange={(e) => setNewAlbumDescription(e.target.value)}
                className="w-full p-2 border rounded mb-2"
                rows={3}
              />
              <div className="flex gap-2">
                <button
                  onClick={createAlbum}
                  className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
                >
                  Create
                </button>
                <button
                  onClick={() => setIsCreatingAlbum(false)}
                  className="bg-gray-600 text-white px-4 py-2 rounded hover:bg-gray-700"
                >
                  Cancel
                </button>
              </div>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {albums.map((album) => (
              <div
                key={album.id}
                onClick={() => setSelectedAlbum(album)}
                className={`p-4 border rounded-lg cursor-pointer hover:bg-gray-50 relative ${
                  selectedAlbum?.id === album.id ? 'border-blue-500 bg-blue-50' : ''
                }`}
              >
                {/* 3 dots button */}
                <button
                  className="absolute top-2 right-2 p-1 rounded hover:bg-gray-200"
                  onClick={e => {
                    e.stopPropagation();
                    setOpenMenuAlbumId(openMenuAlbumId === album.id ? null : album.id);
                  }}
                >
                  <span className="text-xl">⋮</span>
                </button>
                {/* Dropdown menu */}
                {openMenuAlbumId === album.id && (
                  <div className="absolute top-8 right-2 bg-white border rounded shadow z-20">
                    <button
                      className="block w-full px-4 py-2 text-left hover:bg-gray-100"
                      onClick={e => {
                        e.stopPropagation();
                        handleEditAlbum(album);
                      }}
                    >
                      Edit
                    </button>
                    <button
                      className="block w-full px-4 py-2 text-left text-red-600 hover:bg-gray-100"
                      onClick={e => {
                        e.stopPropagation();
                        handleDeleteAlbum(album.id);
                      }}
                    >
                      Delete
                    </button>
                  </div>
                )}
                <h3 className="font-semibold">{album.title}</h3>
                {album.description && (
                  <p className="text-sm text-gray-600 mt-1">{album.description}</p>
                )}
                <p className="text-xs text-gray-500 mt-2">
                  Created: {new Date(album.createdAt).toLocaleDateString()}
                </p>
              </div>
            ))}
          </div>
        </div>}

        {/* Photo Upload Section */}
        {selectedAlbum && (
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold mb-4">
              Upload Photos to &quot;{selectedAlbum.title}&quot;
            </h2>
            <PhotoUpload
              albumId={selectedAlbum.id}
              userId={Number(userId)}
              onUploadSuccess={handlePhotoUpload}
              onUploadError={handleUploadError}
            />
          </div>
        )}

        {/* Photos Display */}
        {photos.length > 0 && (
          <div className="bg-white rounded-lg shadow p-6 mt-8">
            <h2 className="text-xl font-semibold mb-4">Photos</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {photos.map((photo, idx) => (
                <div
                  key={photo.id}
                  className="border rounded-lg overflow-hidden relative group cursor-pointer"
                  onClick={() => setModalPhotoIndex(idx)}
                >
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDeletePhoto(photo.id);
                    }}
                    className="absolute top-2 right-2 bg-red-500 text-white rounded-full w-8 h-8 flex items-center justify-center text-lg font-bold hover:bg-red-600 z-10 opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <span className="flex items-center justify-center w-full h-full">×</span>
                  </button>
                  <Image
                    src={`/api/photos/${photo.id}/data`}
                    alt={photo.caption || 'Photo'}
                    width={400}
                    height={192}
                    className="w-full h-48 object-cover"
                  />
                  {photo.caption && (
                    <div className="p-3">
                      <p className="text-sm text-gray-700">{photo.caption}</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
            {/* Photo Modal */}
            {modalPhotoIndex !== null && (
              <PhotoModal
                photos={photos}
                currentIndex={modalPhotoIndex}
                onClose={() => setModalPhotoIndex(null)}
                onPrev={() => setModalPhotoIndex(idx => (idx !== null ? (idx - 1 + photos.length) % photos.length : 0))}
                onNext={() => setModalPhotoIndex(idx => (idx !== null ? (idx + 1) % photos.length : 0))}
              />
            )}
          </div>
        )}

        {editingAlbum && (
          <EditAlbumModal
            album={editingAlbum}
            onClose={() => setEditingAlbum(null)}
            onSave={handleSaveAlbum}
          />
        )}
      </div>
    </div>
  );
} 