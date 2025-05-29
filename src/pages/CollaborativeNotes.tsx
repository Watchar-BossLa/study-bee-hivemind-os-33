
import React, { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { FileText, Plus, Edit, Trash2, Share } from 'lucide-react';
import { useCollaborativeNotes } from '@/hooks/collaborativenotes/useCollaborativeNotes';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { CreateNoteData } from '@/services/CollaborativeNotesService';
import { formatDistance } from 'date-fns';

const CollaborativeNotes = () => {
  const { notes, isLoading, fetchNotes, createNote, updateNote, deleteNote } = useCollaborativeNotes();
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [editingNote, setEditingNote] = useState<string | null>(null);
  const [formData, setFormData] = useState<CreateNoteData>({
    title: '',
    content: '',
    subject: '',
    is_shared: true
  });

  useEffect(() => {
    fetchNotes();
  }, [fetchNotes]);

  const handleCreateNote = async (e: React.FormEvent) => {
    e.preventDefault();
    const result = await createNote(formData);
    if (result) {
      setIsCreateDialogOpen(false);
      setFormData({
        title: '',
        content: '',
        subject: '',
        is_shared: true
      });
    }
  };

  const handleUpdateNote = async (noteId: string, updates: Partial<CreateNoteData>) => {
    await updateNote(noteId, updates);
    setEditingNote(null);
  };

  const handleDeleteNote = async (noteId: string) => {
    if (window.confirm('Are you sure you want to delete this note?')) {
      await deleteNote(noteId);
    }
  };

  return (
    <>
      <Helmet>
        <title>Collaborative Notes - Study Bee</title>
        <meta name="description" content="Create and share notes with your study groups" />
      </Helmet>
      
      <div className="min-h-screen bg-gradient-to-br from-yellow-50 to-amber-50 dark:from-gray-900 dark:to-gray-800 p-4">
        <div className="container mx-auto max-w-6xl">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Collaborative Notes</h1>
            <p className="text-gray-600 dark:text-gray-300">
              Create and share notes with your study groups for collaborative learning
            </p>
          </div>

          <div className="mb-6">
            <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
              <DialogTrigger asChild>
                <Button className="flex items-center gap-2">
                  <Plus className="h-4 w-4" />
                  Create Note
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl">
                <DialogHeader>
                  <DialogTitle>Create Collaborative Note</DialogTitle>
                  <DialogDescription>
                    Create a new note that can be shared and edited collaboratively
                  </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleCreateNote} className="space-y-4">
                  <div>
                    <Label htmlFor="title">Title</Label>
                    <Input
                      id="title"
                      value={formData.title}
                      onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="subject">Subject (Optional)</Label>
                    <Select
                      value={formData.subject}
                      onValueChange={(value) => setFormData(prev => ({ ...prev, subject: value }))}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select a subject" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="mathematics">Mathematics</SelectItem>
                        <SelectItem value="science">Science</SelectItem>
                        <SelectItem value="english">English</SelectItem>
                        <SelectItem value="history">History</SelectItem>
                        <SelectItem value="computer-science">Computer Science</SelectItem>
                        <SelectItem value="business">Business</SelectItem>
                        <SelectItem value="languages">Languages</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="content">Content</Label>
                    <Textarea
                      id="content"
                      value={formData.content}
                      onChange={(e) => setFormData(prev => ({ ...prev, content: e.target.value }))}
                      placeholder="Start writing your note..."
                      className="min-h-[200px]"
                    />
                  </div>
                  <Button type="submit" className="w-full">
                    Create Note
                  </Button>
                </form>
              </DialogContent>
            </Dialog>
          </div>

          {isLoading ? (
            <div className="text-center py-8">Loading notes...</div>
          ) : (
            <div className="grid gap-6">
              {notes.map((note) => (
                <Card key={note.id} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <CardTitle className="text-xl">{note.title}</CardTitle>
                        <CardDescription className="mt-1">
                          Created by {note.creator_profile?.full_name || 'Anonymous'} • {' '}
                          {formatDistance(new Date(note.created_at), new Date(), { addSuffix: true })}
                        </CardDescription>
                      </div>
                      <div className="flex items-center gap-2">
                        {note.subject && (
                          <Badge variant="secondary">{note.subject}</Badge>
                        )}
                        {note.is_shared && (
                          <Badge variant="outline">
                            <Share className="h-3 w-3 mr-1" />
                            Shared
                          </Badge>
                        )}
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {editingNote === note.id ? (
                        <div className="space-y-4">
                          <Textarea
                            value={note.content}
                            onChange={(e) => {
                              // In a real implementation, this would update the note in real-time
                              // For now, we'll just show the interface
                            }}
                            className="min-h-[200px]"
                          />
                          <div className="flex gap-2">
                            <Button 
                              size="sm" 
                              onClick={() => handleUpdateNote(note.id, { content: note.content })}
                            >
                              Save
                            </Button>
                            <Button 
                              size="sm" 
                              variant="outline"
                              onClick={() => setEditingNote(null)}
                            >
                              Cancel
                            </Button>
                          </div>
                        </div>
                      ) : (
                        <div className="space-y-4">
                          <div className="prose prose-sm max-w-none dark:prose-invert">
                            <p className="whitespace-pre-wrap">{note.content || 'No content yet...'}</p>
                          </div>
                          <div className="flex gap-2">
                            <Button 
                              size="sm" 
                              variant="outline"
                              onClick={() => setEditingNote(note.id)}
                            >
                              <Edit className="h-4 w-4 mr-2" />
                              Edit
                            </Button>
                            <Button 
                              size="sm" 
                              variant="outline"
                              onClick={() => handleDeleteNote(note.id)}
                            >
                              <Trash2 className="h-4 w-4 mr-2" />
                              Delete
                            </Button>
                          </div>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}

          {!isLoading && notes.length === 0 && (
            <div className="text-center py-12">
              <FileText className="h-16 w-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                No Notes Yet
              </h3>
              <p className="text-gray-600 dark:text-gray-300 mb-4">
                Create your first collaborative note to start sharing knowledge with your study groups
              </p>
              <Button onClick={() => setIsCreateDialogOpen(true)}>
                Create Your First Note
              </Button>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default CollaborativeNotes;
