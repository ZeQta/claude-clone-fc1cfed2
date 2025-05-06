
import React from 'react';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { UserRound } from 'lucide-react';

interface UserAvatarProps {
  userName: string;
}

const UserAvatar: React.FC<UserAvatarProps> = ({ userName }) => {
  // Create initials from the user's name
  const getInitials = (name: string) => {
    if (!name || name === 'User') return '';
    
    const names = name.split(' ');
    if (names.length === 1) {
      return names[0].charAt(0).toUpperCase();
    } else {
      return (names[0].charAt(0) + names[names.length - 1].charAt(0)).toUpperCase();
    }
  };

  const initials = getInitials(userName);

  return (
    <Avatar className="h-10 w-10 bg-claude-coral text-white">
      <AvatarFallback>
        {initials || <UserRound className="h-6 w-6" />}
      </AvatarFallback>
    </Avatar>
  );
};

export default UserAvatar;
