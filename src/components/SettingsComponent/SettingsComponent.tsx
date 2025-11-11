import { useUserDataContext } from '@/context/userContext';
import styles from './styles.module.css';
import Image from 'next/image';
import Link from 'next/link';
import { useState, useEffect, useRef } from 'react';

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
            setAvatarPreview(URL.createObjectURL(file));
        }
    };

    const handleFileButtonClick = () => {
        fileInputRef.current?.click();
    };

    const handleSave = async () => {
        // console.log('Zapisywane dane:', formData);
        // console.log('Plik do wysłania:', avatarFile);
        try {
            setPending(true)

            const response = await fetch(`/api/users/${userData?.id}`, {
                method: 'PUT',
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ name: formData.name, phone: formData.phone })
            })

            const data = await response.json()

            if (data.email) {
                console.log("success")
                setPending(false)
            }
        } finally {
            setPending(false)
        }
    };


    return (
        <div className={styles.page}>
            <h1>Account Settings</h1>

            <div className={styles.block}>
                <label htmlFor='avatar'>Avatar</label>
                <div className={styles.blockRow}>
                    <Image
                        src={avatarPreview}
                        width={60}
                        height={60}
                        alt='User Avatar'
                    />

                    <input
                        type='file'
                        style={{ display: 'none' }}
                        ref={fileInputRef}
                        accept='image/*'
                        onChange={handleFileChange}
                    />
                    <button
                        onClick={handleFileButtonClick}
                        disabled={isPending}
                    >
                        {avatarFile ? 'Change photo' : 'Select photo'}
                    </button>
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

            <div className={styles.block}>
                <label>Password</label>
                <Link href={'/auth/change-password'}>change password</Link>
            </div>

            <button onClick={handleSave} disabled={pending}>{pending ? "Saving..." : "Save"}</button>
        </div>
    );
}

export default SettingsComponent;