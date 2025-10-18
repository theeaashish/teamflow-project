import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import Image from 'next/image';

const members = [
  {
    id: 1,
    name: 'John Doe',
    imageUrl: 'https://avatar.vercel.sh/rauchg',
    email: 'john.doe@example.com',
  },
  {
    id: 2,
    name: 'Jane Doe',
    imageUrl: 'https://avatar.vercel.sh/rauchg',
    email: 'jane.doe@example.com',
  },
  {
    id: 3,
    name: 'John Doe',
    imageUrl: 'https://avatar.vercel.sh/rauchg',
    email: 'john.doe@example.com',
  },
];

export function WorkspaceMembersList() {
  return (
    <div className="space-y-0.5 py-1">
      {members.map((member) => (
        <div key={member.id}>
          <div className="relative">
            <Avatar>
              <Image
                src={member.imageUrl}
                alt="user image"
                className="object-cover"
              />

              <AvatarFallback>
                {member.name.charAt(0).toUpperCase()}
              </AvatarFallback>
            </Avatar>
          </div>
        </div>
      ))}
    </div>
  );
}
