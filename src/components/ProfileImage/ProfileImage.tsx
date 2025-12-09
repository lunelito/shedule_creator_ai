import Image from 'next/image';
import React from 'react';

type ProfileImageType = 'read-only' | 'read-and-insert';

interface ProfileImageProps {
  src: string;
  size: number;
  type?: ProfileImageType;
}

const ProfileImage: React.FC<ProfileImageProps> = ({
  src,
  size,
  type = 'read-only',
}) => {
  const isEditable = type === 'read-and-insert';

  return (
    <div
      style={{
        position: 'relative',
        width: size,
        height: size,
        borderRadius: '50%',
        overflow: 'hidden',
        boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
      }}
    >
      <Image
        src={src}
        alt="Zdjęcie profilowe"
        fill
        style={{ objectFit: 'cover' }}
        sizes={`${size}px`}
        priority
      />
    </div>
  );
};

export default ProfileImage;