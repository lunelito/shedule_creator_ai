import { useUserDataContext } from "@/context/userContext";
import styles from "./styles.module.css";
import { useState, useEffect, useRef } from "react";
import ProfileImage from "../ProfileImage/ProfileImage";
import { signOut } from "next-auth/react";
import { useRouter } from "next/navigation";

const SettingsComponent = () => {
  const { userData, isPending } = useUserDataContext();
  const router = useRouter();

  const [formData, setFormData] = useState({
    name: userData?.name || "",
    email: userData?.email || "",
    phone: userData?.phone || "",
  });

  const [avatarFile, setAvatarFile] = useState(null);

  const [avatarPreview, setAvatarPreview] = useState(
    userData?.image || "/images/pfp-placeholder.png"
  );

  const [pending, setPending] = useState<boolean>(false);
  const [isAvatarEditable, setIsAvatarEditable] = useState<boolean>(true);

  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (userData) {
      setFormData({
        name: userData.name || "",
        email: userData.email || "",
        phone: userData.phone || "",
      });
      setAvatarPreview(userData.image || "/images/pfp-placeholder.png");
    }
  }, [userData]);

  const handleInputChange = (e: any) => {
    const { id, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [id]: value,
    }));
  };

  const handleFileChange = (e: any) => {
    const file = e.target.files[0];
    if (file) {
      setAvatarFile(file);
      console.log(file);
      setAvatarPreview(URL.createObjectURL(file));
    }
  };

  const handleFileButtonClick = () => {
    fileInputRef.current?.click();
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
        <label htmlFor="avatar">Avatar</label>
        <div className={styles.blockRow}>
          <ProfileImage
            src={avatarPreview}
            size={65}
            type={isAvatarEditable ? "read-and-insert" : "read-only"}
          />

          <input
            type="file"
            style={{ display: "none" }}
            ref={fileInputRef}
            accept="image/*"
            onChange={handleFileChange}
          />
          {isAvatarEditable && (
            <button onClick={handleFileButtonClick} className="ml-auto">
              Change Avatar
            </button>
          )}
        </div>
      </div>

      <div className={styles.block}>
        <label htmlFor="email-display">Email (Account)</label>
        <input
          id="email-display"
          type="text"
          placeholder={"Your email"}
          disabled
          defaultValue={userData?.email || ""}
        />
      </div>

      <div className={styles.block}>
        <label htmlFor="name">Name</label>
        <input
          id="name"
          type="text"
          placeholder={"Your name"}
          value={formData.name}
          onChange={handleInputChange}
          disabled={isPending}
        />
      </div>

      <div className={styles.block}>
        <label htmlFor="phone">Phone</label>
        <input
          id="phone"
          type="text"
          placeholder={"Your phone number"}
          value={formData.phone}
          onChange={handleInputChange}
          disabled={isPending}
        />
      </div>
      <div className="flex justify-end gap-4 mt-6">
        <button onClick={() => handleLogOut()} className={styles.logoutButton}>
          Log Out
        </button>
        <button  disabled={pending}>
          {pending ? "Saving..." : "Save"}
        </button>
        <button onClick={() => router.replace("/manage/settings/inbox")}>inbox</button>
      </div>
    </div>
  );
};

export default SettingsComponent;
