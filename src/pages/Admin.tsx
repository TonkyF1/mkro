import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { 
  Shield, 
  Crown, 
  Search,
  Loader2,
  Calendar,
  Mail,
  CheckCircle,
  XCircle
} from 'lucide-react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

interface UserProfile {
  user_id: string;
  name: string;
  subscription_status: string;
  is_premium: boolean;
  subscription_expiry: string | null;
  stripe_customer_id: string | null;
  created_at: string;
}

const Admin = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { toast } = useToast();
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [updatingUserId, setUpdatingUserId] = useState<string | null>(null);

  useEffect(() => {
    if (!user) {
      navigate('/profile');
      return;
    }
    
    fetchUsers();
  }, [user]);

  const fetchUsers = async () => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;

      setUsers(data || []);
    } catch (error: any) {
      console.error('Error fetching users:', error);
      toast({
        title: 'Error',
        description: 'Failed to load users',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const togglePremium = async (userId: string, currentStatus: boolean) => {
    setUpdatingUserId(userId);

    try {
      const newStatus = !currentStatus;
      const { error } = await supabase
        .from('profiles')
        .update({
          is_premium: newStatus,
          subscription_status: newStatus ? 'premium' : 'free',
          subscription_expiry: newStatus ? new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString() : null,
        })
        .eq('user_id', userId);

      if (error) throw error;

      toast({
        title: 'Success',
        description: `User ${newStatus ? 'upgraded to' : 'downgraded from'} Premium`,
      });

      fetchUsers();
    } catch (error: any) {
      console.error('Error toggling premium:', error);
      toast({
        title: 'Error',
        description: 'Failed to update user status',
        variant: 'destructive',
      });
    } finally {
      setUpdatingUserId(null);
    }
  };

  const filteredUsers = users.filter(user => 
    user.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.user_id.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const premiumCount = users.filter(u => u.is_premium).length;
  const freeCount = users.filter(u => !u.is_premium).length;

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-primary/5 to-background">
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <Shield className="h-8 w-8 text-primary" />
            <h1 className="text-4xl font-black">Admin Dashboard</h1>
          </div>
          <p className="text-muted-foreground">Manage user subscriptions and premium access</p>
        </div>

        {/* Stats Cards */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardHeader className="pb-3">
              <CardDescription>Total Users</CardDescription>
              <CardTitle className="text-4xl">{users.length}</CardTitle>
            </CardHeader>
          </Card>
          <Card>
            <CardHeader className="pb-3">
              <CardDescription className="flex items-center gap-2">
                <Crown className="h-4 w-4 text-primary" />
                Premium Users
              </CardDescription>
              <CardTitle className="text-4xl text-primary">{premiumCount}</CardTitle>
            </CardHeader>
          </Card>
          <Card>
            <CardHeader className="pb-3">
              <CardDescription>Free Users</CardDescription>
              <CardTitle className="text-4xl">{freeCount}</CardTitle>
            </CardHeader>
          </Card>
        </div>

        {/* Users Table */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>User Management</CardTitle>
              <div className="flex items-center gap-2 w-full max-w-sm">
                <Search className="h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search by name or ID..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="flex-1"
                />
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>User</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Expiry</TableHead>
                    <TableHead>Stripe ID</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredUsers.map((user) => (
                    <TableRow key={user.user_id}>
                      <TableCell>
                        <div className="space-y-1">
                          <div className="font-medium">{user.name || 'No name'}</div>
                          <div className="text-xs text-muted-foreground">{user.user_id}</div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant={user.is_premium ? 'default' : 'secondary'}
                          className="gap-1"
                        >
                          {user.is_premium ? (
                            <Crown className="h-3 w-3" />
                          ) : null}
                          {user.subscription_status || 'free'}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        {user.subscription_expiry ? (
                          <div className="flex items-center gap-1 text-sm">
                            <Calendar className="h-3 w-3" />
                            {new Date(user.subscription_expiry).toLocaleDateString()}
                          </div>
                        ) : (
                          <span className="text-muted-foreground text-sm">-</span>
                        )}
                      </TableCell>
                      <TableCell>
                        {user.stripe_customer_id ? (
                          <div className="flex items-center gap-1">
                            <CheckCircle className="h-3 w-3 text-green-500" />
                            <span className="text-xs text-muted-foreground">Connected</span>
                          </div>
                        ) : (
                          <div className="flex items-center gap-1">
                            <XCircle className="h-3 w-3 text-muted-foreground" />
                            <span className="text-xs text-muted-foreground">No connection</span>
                          </div>
                        )}
                      </TableCell>
                      <TableCell>
                        <Button
                          size="sm"
                          variant={user.is_premium ? 'destructive' : 'default'}
                          onClick={() => togglePremium(user.user_id, user.is_premium)}
                          disabled={updatingUserId === user.user_id}
                        >
                          {updatingUserId === user.user_id ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                          ) : user.is_premium ? (
                            'Revoke Premium'
                          ) : (
                            'Grant Premium'
                          )}
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Admin;