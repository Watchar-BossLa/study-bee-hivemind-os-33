
import React, { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Users, Plus, Lock, Unlock } from 'lucide-react';
import { useStudyGroups } from '@/hooks/studygroups/useStudyGroups';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { CreateStudyGroupData } from '@/services/StudyGroupService';

const StudyGroups = () => {
  const { groups, isLoading, fetchGroups, createGroup, joinGroup } = useStudyGroups();
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isJoinDialogOpen, setIsJoinDialogOpen] = useState(false);
  const [selectedGroupId, setSelectedGroupId] = useState('');
  const [accessCode, setAccessCode] = useState('');
  const [formData, setFormData] = useState<CreateStudyGroupData>({
    name: '',
    description: '',
    subject: '',
    max_members: 10,
    is_private: false
  });

  useEffect(() => {
    fetchGroups();
  }, [fetchGroups]);

  const handleCreateGroup = async (e: React.FormEvent) => {
    e.preventDefault();
    const result = await createGroup(formData);
    if (result) {
      setIsCreateDialogOpen(false);
      setFormData({
        name: '',
        description: '',
        subject: '',
        max_members: 10,
        is_private: false
      });
    }
  };

  const handleJoinGroup = async (e: React.FormEvent) => {
    e.preventDefault();
    const success = await joinGroup(selectedGroupId, accessCode);
    if (success) {
      setIsJoinDialogOpen(false);
      setAccessCode('');
      setSelectedGroupId('');
    }
  };

  return (
    <>
      <Helmet>
        <title>Study Groups - Study Bee</title>
        <meta name="description" content="Join or create collaborative study groups to learn together" />
      </Helmet>
      
      <div className="min-h-screen bg-gradient-to-br from-yellow-50 to-amber-50 dark:from-gray-900 dark:to-gray-800 p-4">
        <div className="container mx-auto max-w-6xl">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Study Groups</h1>
            <p className="text-gray-600 dark:text-gray-300">
              Join or create collaborative study groups to learn together with peers
            </p>
          </div>

          <div className="flex gap-4 mb-6">
            <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
              <DialogTrigger asChild>
                <Button className="flex items-center gap-2">
                  <Plus className="h-4 w-4" />
                  Create Group
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Create Study Group</DialogTitle>
                  <DialogDescription>
                    Create a new study group for collaborative learning
                  </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleCreateGroup} className="space-y-4">
                  <div>
                    <Label htmlFor="name">Group Name</Label>
                    <Input
                      id="name"
                      value={formData.name}
                      onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="subject">Subject</Label>
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
                    <Label htmlFor="description">Description (Optional)</Label>
                    <Textarea
                      id="description"
                      value={formData.description}
                      onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                      placeholder="Describe what this group will focus on..."
                    />
                  </div>
                  <div>
                    <Label htmlFor="max_members">Maximum Members</Label>
                    <Input
                      id="max_members"
                      type="number"
                      min="2"
                      max="50"
                      value={formData.max_members}
                      onChange={(e) => setFormData(prev => ({ ...prev, max_members: parseInt(e.target.value) }))}
                    />
                  </div>
                  <div className="flex items-center space-x-2">
                    <Switch
                      id="is_private"
                      checked={formData.is_private}
                      onCheckedChange={(checked) => setFormData(prev => ({ ...prev, is_private: checked }))}
                    />
                    <Label htmlFor="is_private">Private Group (requires access code)</Label>
                  </div>
                  <Button type="submit" className="w-full">
                    Create Group
                  </Button>
                </form>
              </DialogContent>
            </Dialog>

            <Button variant="outline" onClick={() => setIsJoinDialogOpen(true)}>
              Join with Code
            </Button>
          </div>

          {isLoading ? (
            <div className="text-center py-8">Loading study groups...</div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {groups.map((group) => (
                <Card key={group.id} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-lg">{group.name}</CardTitle>
                      {group.is_private ? (
                        <Lock className="h-4 w-4 text-gray-500" />
                      ) : (
                        <Unlock className="h-4 w-4 text-green-500" />
                      )}
                    </div>
                    <CardDescription>{group.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <Badge variant="secondary">{group.subject}</Badge>
                      <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300">
                        <Users className="h-4 w-4" />
                        <span>{group.member_count || 0} / {group.max_members} members</span>
                      </div>
                      <Button 
                        className="w-full" 
                        onClick={() => {
                          if (group.is_private) {
                            setSelectedGroupId(group.id);
                            setIsJoinDialogOpen(true);
                          } else {
                            joinGroup(group.id);
                          }
                        }}
                      >
                        Join Group
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}

          {!isLoading && groups.length === 0 && (
            <div className="text-center py-12">
              <Users className="h-16 w-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                No Study Groups Yet
              </h3>
              <p className="text-gray-600 dark:text-gray-300 mb-4">
                Be the first to create a study group and start learning together!
              </p>
              <Button onClick={() => setIsCreateDialogOpen(true)}>
                Create Your First Group
              </Button>
            </div>
          )}

          <Dialog open={isJoinDialogOpen} onOpenChange={setIsJoinDialogOpen}>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Join Private Group</DialogTitle>
                <DialogDescription>
                  Enter the access code to join this private study group
                </DialogDescription>
              </DialogHeader>
              <form onSubmit={handleJoinGroup} className="space-y-4">
                <div>
                  <Label htmlFor="access_code">Access Code</Label>
                  <Input
                    id="access_code"
                    value={accessCode}
                    onChange={(e) => setAccessCode(e.target.value)}
                    placeholder="Enter 6-character code"
                    required
                  />
                </div>
                <Button type="submit" className="w-full">
                  Join Group
                </Button>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </div>
    </>
  );
};

export default StudyGroups;
