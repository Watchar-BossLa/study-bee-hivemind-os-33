
import React, { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { UserPlus, Search, MessageCircle, Check, X } from 'lucide-react';
import { usePeerLearning } from '@/hooks/peerlearning/usePeerLearning';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';

const PeerLearning = () => {
  const { connections, peers, isLoading, fetchConnections, findPeers, createConnection, updateConnection } = usePeerLearning();
  const [isConnectDialogOpen, setIsConnectDialogOpen] = useState(false);
  const [selectedPeerId, setSelectedPeerId] = useState('');
  const [searchSubjects, setSearchSubjects] = useState<string[]>([]);
  const [connectionMessage, setConnectionMessage] = useState('');

  const subjects = [
    'mathematics', 'science', 'english', 'history', 
    'computer-science', 'business', 'languages', 'art', 'music'
  ];

  useEffect(() => {
    fetchConnections();
    findPeers();
  }, [fetchConnections, findPeers]);

  const handleConnectToPeer = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedPeerId) return;

    const result = await createConnection({
      recipient_id: selectedPeerId,
      subjects: searchSubjects,
      message: connectionMessage
    });

    if (result) {
      setIsConnectDialogOpen(false);
      setSelectedPeerId('');
      setConnectionMessage('');
      setSearchSubjects([]);
    }
  };

  const handleSubjectToggle = (subject: string) => {
    setSearchSubjects(prev => 
      prev.includes(subject) 
        ? prev.filter(s => s !== subject)
        : [...prev, subject]
    );
  };

  const searchPeers = () => {
    findPeers(searchSubjects.length > 0 ? searchSubjects : undefined);
  };

  const pendingConnections = connections.filter(c => c.status === 'pending');
  const acceptedConnections = connections.filter(c => c.status === 'accepted');

  return (
    <>
      <Helmet>
        <title>Peer Learning - Study Bee</title>
        <meta name="description" content="Connect with study partners and learn together" />
      </Helmet>
      
      <div className="min-h-screen bg-gradient-to-br from-yellow-50 to-amber-50 dark:from-gray-900 dark:to-gray-800 p-4">
        <div className="container mx-auto max-w-6xl">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Peer Learning</h1>
            <p className="text-gray-600 dark:text-gray-300">
              Connect with study partners and learn together through peer collaboration
            </p>
          </div>

          <Tabs defaultValue="find-peers" className="space-y-6">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="find-peers">Find Peers</TabsTrigger>
              <TabsTrigger value="connections">
                Connections ({acceptedConnections.length})
              </TabsTrigger>
              <TabsTrigger value="requests">
                Requests ({pendingConnections.length})
              </TabsTrigger>
            </TabsList>

            <TabsContent value="find-peers" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Search className="h-5 w-5" />
                    Find Study Partners
                  </CardTitle>
                  <CardDescription>
                    Search for peers who share your learning interests
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <Label>Filter by Subjects</Label>
                      <div className="flex flex-wrap gap-2 mt-2">
                        {subjects.map((subject) => (
                          <div key={subject} className="flex items-center space-x-2">
                            <Checkbox
                              id={subject}
                              checked={searchSubjects.includes(subject)}
                              onCheckedChange={() => handleSubjectToggle(subject)}
                            />
                            <Label htmlFor={subject} className="text-sm capitalize">
                              {subject.replace('-', ' ')}
                            </Label>
                          </div>
                        ))}
                      </div>
                    </div>
                    <Button onClick={searchPeers} className="w-full">
                      Search Peers
                    </Button>
                  </div>
                </CardContent>
              </Card>

              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {peers.map((peer) => (
                  <Card key={peer.id} className="hover:shadow-lg transition-shadow">
                    <CardHeader>
                      <div className="flex items-center gap-3">
                        <Avatar>
                          <AvatarImage src={peer.avatar_url} />
                          <AvatarFallback>
                            {peer.full_name?.charAt(0) || 'U'}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <CardTitle className="text-lg">{peer.full_name || 'Anonymous'}</CardTitle>
                          <CardDescription>{peer.bio}</CardDescription>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        {peer.preferred_subjects && (
                          <div className="flex flex-wrap gap-1">
                            {peer.preferred_subjects.slice(0, 3).map((subject: string) => (
                              <Badge key={subject} variant="secondary" className="text-xs">
                                {subject.replace('-', ' ')}
                              </Badge>
                            ))}
                            {peer.preferred_subjects.length > 3 && (
                              <Badge variant="outline" className="text-xs">
                                +{peer.preferred_subjects.length - 3} more
                              </Badge>
                            )}
                          </div>
                        )}
                        <Button 
                          className="w-full" 
                          onClick={() => {
                            setSelectedPeerId(peer.id);
                            setIsConnectDialogOpen(true);
                          }}
                        >
                          <UserPlus className="h-4 w-4 mr-2" />
                          Connect
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {!isLoading && peers.length === 0 && (
                <div className="text-center py-12">
                  <UserPlus className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                    No Peers Found
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300">
                    Try adjusting your subject filters or check back later for new members
                  </p>
                </div>
              )}
            </TabsContent>

            <TabsContent value="connections" className="space-y-4">
              {acceptedConnections.map((connection) => (
                <Card key={connection.id}>
                  <CardContent className="pt-6">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <Avatar>
                          <AvatarImage 
                            src={connection.requester_profile?.avatar_url || connection.recipient_profile?.avatar_url} 
                          />
                          <AvatarFallback>
                            {(connection.requester_profile?.full_name || connection.recipient_profile?.full_name)?.charAt(0) || 'U'}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <h3 className="font-medium">
                            {connection.requester_profile?.full_name || connection.recipient_profile?.full_name || 'Anonymous'}
                          </h3>
                          <div className="flex flex-wrap gap-1 mt-1">
                            {connection.subjects.map((subject) => (
                              <Badge key={subject} variant="outline" className="text-xs">
                                {subject.replace('-', ' ')}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      </div>
                      <Button variant="outline">
                        <MessageCircle className="h-4 w-4 mr-2" />
                        Message
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}

              {acceptedConnections.length === 0 && (
                <div className="text-center py-12">
                  <MessageCircle className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                    No Connections Yet
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300">
                    Start connecting with peers to build your learning network
                  </p>
                </div>
              )}
            </TabsContent>

            <TabsContent value="requests" className="space-y-4">
              {pendingConnections.map((connection) => (
                <Card key={connection.id}>
                  <CardContent className="pt-6">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <Avatar>
                          <AvatarImage 
                            src={connection.requester_profile?.avatar_url || connection.recipient_profile?.avatar_url} 
                          />
                          <AvatarFallback>
                            {(connection.requester_profile?.full_name || connection.recipient_profile?.full_name)?.charAt(0) || 'U'}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <h3 className="font-medium">
                            {connection.requester_profile?.full_name || connection.recipient_profile?.full_name || 'Anonymous'}
                          </h3>
                          <p className="text-sm text-gray-600 dark:text-gray-300">{connection.message}</p>
                          <div className="flex flex-wrap gap-1 mt-1">
                            {connection.subjects.map((subject) => (
                              <Badge key={subject} variant="outline" className="text-xs">
                                {subject.replace('-', ' ')}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button 
                          size="sm" 
                          onClick={() => updateConnection(connection.id, 'accepted')}
                        >
                          <Check className="h-4 w-4" />
                        </Button>
                        <Button 
                          size="sm" 
                          variant="outline"
                          onClick={() => updateConnection(connection.id, 'declined')}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}

              {pendingConnections.length === 0 && (
                <div className="text-center py-12">
                  <UserPlus className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                    No Pending Requests
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300">
                    Connection requests will appear here when you receive them
                  </p>
                </div>
              )}
            </TabsContent>
          </Tabs>

          <Dialog open={isConnectDialogOpen} onOpenChange={setIsConnectDialogOpen}>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Connect with Peer</DialogTitle>
                <DialogDescription>
                  Send a connection request to start learning together
                </DialogDescription>
              </DialogHeader>
              <form onSubmit={handleConnectToPeer} className="space-y-4">
                <div>
                  <Label>Shared Subjects</Label>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {subjects.map((subject) => (
                      <div key={subject} className="flex items-center space-x-2">
                        <Checkbox
                          id={`connect-${subject}`}
                          checked={searchSubjects.includes(subject)}
                          onCheckedChange={() => handleSubjectToggle(subject)}
                        />
                        <Label htmlFor={`connect-${subject}`} className="text-sm capitalize">
                          {subject.replace('-', ' ')}
                        </Label>
                      </div>
                    ))}
                  </div>
                </div>
                <div>
                  <Label htmlFor="message">Message (Optional)</Label>
                  <Textarea
                    id="message"
                    value={connectionMessage}
                    onChange={(e) => setConnectionMessage(e.target.value)}
                    placeholder="Introduce yourself and mention what you'd like to study together..."
                  />
                </div>
                <Button type="submit" className="w-full">
                  Send Connection Request
                </Button>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </div>
    </>
  );
};

export default PeerLearning;
