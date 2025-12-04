import { useState, useEffect } from 'react';
import { useAuth } from './useAuth';
import { type Event } from '../types';

export const useBookmarks = () => {
  const { user } = useAuth();
  const [bookmarks, setBookmarks] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (user) {
      // Load bookmarks from localStorage
      const stored = localStorage.getItem(`bookmarks_${user.uid}`);
      if (stored) {
        setBookmarks(JSON.parse(stored));
      }
    } else {
      setBookmarks([]);
    }
  }, [user]);

  const isBookmarked = (eventId: string): boolean => {
    return bookmarks.includes(eventId);
  };

  const addBookmark = async (event: Event): Promise<void> => {
    if (!user) return;

    setIsLoading(true);
    try {
      const newBookmarks = [...bookmarks, event.id];
      setBookmarks(newBookmarks);
      localStorage.setItem(`bookmarks_${user.uid}`, JSON.stringify(newBookmarks));
    } catch (error) {
      console.error('Failed to add bookmark:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const removeBookmark = async (eventId: string): Promise<void> => {
    if (!user) return;

    setIsLoading(true);
    try {
      const newBookmarks = bookmarks.filter(id => id !== eventId);
      setBookmarks(newBookmarks);
      localStorage.setItem(`bookmarks_${user.uid}`, JSON.stringify(newBookmarks));
    } catch (error) {
      console.error('Failed to remove bookmark:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    bookmarks,
    isBookmarked,
    addBookmark,
    removeBookmark,
    isLoading,
  };
};
