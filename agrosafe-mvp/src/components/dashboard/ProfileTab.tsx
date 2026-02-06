import { useState } from "react";
import { motion } from "framer-motion";
import { User, MapPin, Wallet, Calendar, CheckCircle2, Edit2, Save } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { MOCK_FARMER } from "@/lib/constants";
import { useToast } from "@/hooks/use-toast";

const ProfileTab = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [profile, setProfile] = useState(MOCK_FARMER);
  const { toast } = useToast();

  const handleSave = () => {
    setIsEditing(false);
    toast({
      title: "Profile Updated",
      description: "Your profile changes have been saved.",
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-display font-bold text-foreground">My Profile</h2>
          <p className="text-muted-foreground mt-1">Manage your farmer registration details</p>
        </div>
        <Button
          variant={isEditing ? "default" : "outline"}
          onClick={isEditing ? handleSave : () => setIsEditing(true)}
        >
          {isEditing ? (
            <>
              <Save className="w-4 h-4 mr-2" />
              Save Changes
            </>
          ) : (
            <>
              <Edit2 className="w-4 h-4 mr-2" />
              Edit Profile
            </>
          )}
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Profile Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-card rounded-xl border border-border p-6 text-center"
        >
          <div className="w-24 h-24 mx-auto rounded-full bg-gradient-to-br from-primary to-emerald-glow flex items-center justify-center mb-4">
            <User className="w-12 h-12 text-primary-foreground" />
          </div>
          <h3 className="text-xl font-display font-bold text-foreground">{profile.name}</h3>
          <p className="text-muted-foreground">{profile.farmName}</p>
          <div className="flex items-center justify-center gap-2 mt-3">
            {profile.verified && (
              <span className="flex items-center gap-1 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-600 text-sm font-medium">
                <CheckCircle2 className="w-4 h-4" />
                Verified Farmer
              </span>
            )}
          </div>
          <p className="text-xs font-mono text-muted-foreground mt-4 bg-muted px-3 py-2 rounded-lg">
            ID: {profile.id}
          </p>
        </motion.div>

        {/* Profile Details */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="lg:col-span-2 bg-card rounded-xl border border-border p-6"
        >
          <h3 className="text-lg font-display font-semibold text-foreground mb-4">Farm Details</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-muted-foreground">Full Name</label>
              {isEditing ? (
                <Input
                  value={profile.name}
                  onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                />
              ) : (
                <div className="flex items-center gap-2 p-3 rounded-lg bg-muted">
                  <User className="w-4 h-4 text-primary" />
                  <span className="text-foreground">{profile.name}</span>
                </div>
              )}
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-muted-foreground">Farm Name</label>
              {isEditing ? (
                <Input
                  value={profile.farmName}
                  onChange={(e) => setProfile({ ...profile, farmName: e.target.value })}
                />
              ) : (
                <div className="flex items-center gap-2 p-3 rounded-lg bg-muted">
                  <span className="text-foreground">{profile.farmName}</span>
                </div>
              )}
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-muted-foreground">Location</label>
              {isEditing ? (
                <Input
                  value={profile.location}
                  onChange={(e) => setProfile({ ...profile, location: e.target.value })}
                />
              ) : (
                <div className="flex items-center gap-2 p-3 rounded-lg bg-muted">
                  <MapPin className="w-4 h-4 text-primary" />
                  <span className="text-foreground">{profile.location}</span>
                </div>
              )}
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-muted-foreground">Farm Size</label>
              {isEditing ? (
                <Input
                  value={profile.farmSize}
                  onChange={(e) => setProfile({ ...profile, farmSize: e.target.value })}
                />
              ) : (
                <div className="flex items-center gap-2 p-3 rounded-lg bg-muted">
                  <span className="text-foreground">{profile.farmSize}</span>
                </div>
              )}
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-muted-foreground">Wallet Address</label>
              <div className="flex items-center gap-2 p-3 rounded-lg bg-muted">
                <Wallet className="w-4 h-4 text-primary" />
                <span className="text-foreground font-mono text-sm truncate">{profile.walletAddress}</span>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-muted-foreground">Registered Date</label>
              <div className="flex items-center gap-2 p-3 rounded-lg bg-muted">
                <Calendar className="w-4 h-4 text-primary" />
                <span className="text-foreground">{profile.registeredAt}</span>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default ProfileTab;
