import { Camera, Building } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

const ProfileCard = ({ profileData }) => {
  return (
    <Card className="bg-white/60 dark:bg-black/40 shadow-xl rounded-2xl border border-white/20 backdrop-blur-md">
      <CardContent className="p-6">
        <div className="flex items-center space-x-6">
          {/* Avatar with initials */}
          <div className="relative">
            <div className="w-24 h-24 bg-gradient-to-br from-blue-600 to-purple-600 rounded-2xl flex items-center justify-center text-white text-3xl font-bold shadow-lg">
              {profileData.firstName?.[0]}{profileData.lastName?.[0]}
            </div>

            {/* Camera Button */}
            <button
              className="absolute -bottom-2 -right-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white p-2 rounded-full shadow-md hover:shadow-lg transition-transform duration-200 hover:scale-110"
              title="Change profile picture"
              aria-label="Change profile picture"
            >
              <Camera className="w-4 h-4" />
            </button>
          </div>

          {/* Name and Info */}
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              {profileData.firstName} {profileData.lastName}
            </h1>
            <p className="text-lg text-gray-800 dark:text-gray-200 mt-1">{profileData.position}</p>
            <p className="text-sm text-gray-600 dark:text-gray-400 flex items-center mt-1">
              <Building className="w-4 h-4 mr-1" />
              {profileData.department}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ProfileCard;
