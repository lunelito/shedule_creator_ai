import { useUserDataContext } from '@/context/userContext';
import styles from './styles.module.css';
import Image from 'next/image';
import Link from 'next/link';
import { useState, useEffect, useRef } from 'react';
import { createClient } from '@supabase/supabase-js'
import ProfileImage from '../ProfileImage/ProfileImage';
import { signOut } from 'next-auth/react';

const supabaseUrl: string = process.env.NEXT_PUBLIC_SUPABASE_URL || "YOUR_SUPABASE_URL";
const supabaseAnonKey: string = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "YOUR_ANON_KEY";

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

const SettingsComponent = () => {
    const { userData, isPending } = useUserDataContext();

    const [formData, setFormData] = useState({
        name: userData?.name || '',
        email: userData?.email || '',
        phone: userData?.phone || '',
    });

    const [avatarFile, setAvatarFile] = useState(null);

    const [avatarPreview, setAvatarPreview] = useState(userData?.image || '/images/pfp-placeholder.png');
    const [pending, setPending] = useState<boolean>(false)
    const [isAvatarEditable, setIsAvatarEditable] = useState<boolean>(true);

    const fileInputRef = useRef<HTMLInputElement>(null);


    useEffect(() => {
        if (userData) {
            setFormData({
                name: userData.name || '',
                email: userData.email || '',
                phone: userData.phone || '',
            });
            setAvatarPreview(userData.image || '/images/pfp-placeholder.png');
        }
    }, [userData]);



    const handleInputChange = (e: any) => {
        const { id, value } = e.target;
        setFormData(prevData => ({
            ...prevData,
            [id]: value
        }));
    };

    const handleFileChange = (e: any) => {
        const file = e.target.files[0];
        if (file) {
            setAvatarFile(file);
            console.log(file)
            setAvatarPreview(URL.createObjectURL(file));
        }
    };

    const handleFileButtonClick = () => {
        fileInputRef.current?.click();
    };

    async function uploadFile(file: any) {
        const fileExt = file.name.split('.').pop();
        const fileName = `user-${userData?.id}-${file.name}`;
        const filePath = `avatars/${fileName}`;

        const { data, error } = await supabase.storage
            .from('avatars')
            .upload(filePath, file, {
                upsert: true,
                cacheControl: '3600'
            });

        const { data: publicUrlData } = supabase.storage
            .from('avatars')
            .getPublicUrl(filePath);

        return publicUrlData.publicUrl;

        if (error) {
            console.log(error)
            // Handle error
        } else {

        }
    }

    const handleSave = async () => {
        // console.log('Zapisywane dane:', formData);
        // console.log('Plik do wysłania:', avatarFile);
        try {
            setPending(true)

            const avatarUrl = await uploadFile(avatarFile)

            const response = await fetch(`/api/users/${userData?.id}`, {
                method: 'PUT',
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ name: formData.name, phone: formData.phone, image: avatarUrl })
            })

            const data = await response.json()

            if (data.email) {
                uploadFile(avatarFile)
                console.log("success")
                setPending(false)
            }
        } finally {
            setPending(false)
        }
    };

    const handleLogOut = async () => {
        await signOut({
            redirect: true,
            callbackUrl: "/",
        });
    };

    return (
        <div className={styles.page}>
            <h1>Account Settings</h1>

            <div className={styles.block}>
                <label htmlFor='avatar'>Avatar</label>
                <div className={styles.blockRow}>
                    <ProfileImage
                        src={avatarPreview}
                        size={65}
                        type={isAvatarEditable ? 'read-and-insert' : 'read-only'}
                    />

                    <input
                        type='file'
                        style={{ display: 'none' }}
                        ref={fileInputRef}
                        accept='image/*'
                        onChange={handleFileChange}
                    />
                    {isAvatarEditable && (
                        <button onClick={handleFileButtonClick} className='ml-auto'>Change Avatar</button>
                    )}
                </div>
            </div>

            <div className={styles.block}>
                <label htmlFor='email-display'>Email (Account)</label>
                <input id='email-display' type='text' placeholder={'Your email'} disabled defaultValue={userData?.email || ''} />
            </div>

            <div className={styles.block}>
                <label htmlFor="name">Name</label>
                <input
                    id='name'
                    type='text'
                    placeholder={'Your name'}
                    value={formData.name}
                    onChange={handleInputChange}
                    disabled={isPending}
                />
            </div>

            <div className={styles.block}>
                <label htmlFor='phone'>Phone</label>
                <input
                    id='phone'
                    type='text'
                    placeholder={'Your phone number'}
                    value={formData.phone}
                    onChange={handleInputChange}
                    disabled={isPending}
                />
            </div>

            {/* <div className={styles.block}>
                <label>Password</label>
                <Link href={'/auth/change-password'}>change password</Link>
            </div> */}
            <div className="flex justify-end gap-4 mt-6">
                <button onClick={() => handleLogOut()} className={styles.logoutButton}>Log Out</button>
                <button onClick={handleSave} disabled={pending}>{pending ? "Saving..." : "Save"}</button>
            </div>
        </div>
    );
}

export default SettingsComponent;