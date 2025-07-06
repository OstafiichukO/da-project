'use client';

import { useState, useEffect } from 'react';
import { PhotoUpload } from 'app/components/PhotoUpload';

interface Album {
  id: number;
  title: string;
  description?: string;
  createdAt: string;
}

interface Photo {
  id: number;
  url: string;
  caption?: string;
  createdAt: string;
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

  const handlePhotoUpload = async (fileUrl: string) => {
    if (!selectedAlbum) return;

    try {
      const response = await fetch('/api/photos', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          albumId: selectedAlbum.id,
          userId,
          url: fileUrl,
        }),
      });

      if (response.ok) {
        const result = await response.json();
        setPhotos([...photos, result.photo]);
      }
    } catch (error) {
      console.error('Error saving photo:', error);
    }
  };

  const handleUploadError = (error: string) => {
    alert(`Upload error: ${error}`);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Photo Gallery</h1>
        {loading && <div>Loading albums...</div>}
        {error && <div className="text-red-500">{error}</div>}
        {/* Albums Section */}
        <div className="bg-white rounded-lg shadow p-6 mb-8">
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
                className={`p-4 border rounded-lg cursor-pointer hover:bg-gray-50 ${
                  selectedAlbum?.id === album.id ? 'border-blue-500 bg-blue-50' : ''
                }`}
              >
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
        </div>

        {/* Photo Upload Section */}
        {selectedAlbum && (
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold mb-4">
              Upload Photos to "{selectedAlbum.title}"
            </h2>
            <PhotoUpload
              onUploadSuccess={handlePhotoUpload}
              onUploadError={handleUploadError}
            />
          </div>
        )}

        {/* Photos Display */}
        {photos.length > 0 && (
          <div className="bg-white rounded-lg shadow p-6 mt-8">
            <h2 className="text-xl font-semibold mb-4">Photos</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {photos.map((photo) => (
                <div key={photo.id} className="border rounded-lg overflow-hidden">
                  <img
                    src={photo.url}
                    alt={photo.caption || 'Photo'}
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
          </div>
        )}
      </div>
    </div>
  );
} 