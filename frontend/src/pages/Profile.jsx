import { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import Navbar from '../components/Navbar';
import { getToken } from '../utils/auth';
import { fetchProfile, profileCompleteness } from '../utils/profile';
import { IoCloseCircleSharp } from "react-icons/io5";
import { MdModeEditOutline } from "react-icons/md";

const Profile = () => {
    const [user, setUser] = useState({
        name: '',
        contact: '',
        email: '',
        hobbies: '',
        profilePicture: '',
        alternateEmail: '',
        location: '',
        homeTown: '',
        profession: '',
    });
    const [selectedFile, setSelectedFile] = useState(null);
    const [completeness, setCompleteness] = useState(0);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        contact: '',
        hobbies: '',
        alternateEmail: '',
        location: '',
        homeTown: '',
        profession: '',
        profilePicture: '',
    });
    

    useEffect(() => {
        const loadProfile = async () => {
            try {
                // Call the refactored function directly
                const profileData = await fetchProfile();

                if (profileData) {
                    setUser(profileData);
                    setFormData({
                        name: profileData.name || '',
                        contact: profileData.contact || '',
                        hobbies: profileData.hobbies || '',
                        alternateEmail: profileData.alternateEmail || '',
                        location: profileData.location || '',
                        homeTown: profileData.homeTown || '',
                        profession: profileData.profession || '',
                        profilePicture: profileData.profilePicture || '',
                    });
                    setCompleteness(profileCompleteness(profileData));
                }
            } catch (error) {
                console.error("Failed to load profile component state:", error);
                toast.error("Could not load profile details. Please check your connection or log in again.");
            }
        };

        loadProfile();
    }, []);

    const openModal = () => {
        setFormData({
            name: user.name || '',
            contact: user.contact || '',
            hobbies: user.hobbies || '',
            alternateEmail: user.alternateEmail || '',
            location: user.location || '',
            homeTown: user.homeTown || '',
            profession: user.profession || '',
            profilePicture: user.profilePicture || '',
        });
        setSelectedFile(null);
        setIsModalOpen(true);
    };

    const handleUpdateProfile = async (e) => {
        e.preventDefault();
        const payload = new FormData();
        payload.append('name', formData.name);
        payload.append('contact', formData.contact);
        payload.append('hobbies', formData.hobbies);
        payload.append('alternateEmail', formData.alternateEmail);
        payload.append('location', formData.location);
        payload.append('homeTown', formData.homeTown);
        payload.append('profession', formData.profession);

        console.log("Checking selected file state:", selectedFile);
        if (selectedFile) {
            payload.append('profilePicture', selectedFile);
        }

        for (let pair of payload.entries()) {
            console.log(pair[0] + ': ' + pair[1]);
        }

        try {
            console.log('payload : ', payload);
            // ✅ Catch the response object coming back from the backend
            const response = await axios.patch('http://127.0.0.1:5000/api/profile/update_profile', payload, {
                headers: {
                    Authorization: `Bearer ${getToken()}`,
                    'Content-Type': 'multipart/form-data',
                },
            });

            // ✅ Destructure the transformed user data returned by the backend fix
            const { user: serverUpdatedUser } = response.data;

            const updatedProfile = {
                ...user,
                name: formData.name,
                contact: formData.contact,
                hobbies: formData.hobbies,
                alternateEmail: formData.alternateEmail,
                location: formData.location,
                homeTown: formData.homeTown,
                profession: formData.profession,
                profilePicture: selectedFile ? serverUpdatedUser.profilePicture : user.profilePicture,
            };

            setUser(updatedProfile);
            setCompleteness(profileCompleteness(updatedProfile));
            setIsModalOpen(false);
            toast.success('Profile updated successfully!');
        } catch (error) {
            console.error(error);
            toast.error('Failed to update profile');
        }
    };

    return (
        <div className="min-h-screen bg-[radial-gradient(circle_at_top_left,rgba(59,130,246,0.16),transparent_30%),linear-gradient(135deg,#f8fbff_0%,#f3f6ff_45%,#eef2ff_100%)]">
            <Navbar />

            {/* <div className="mx-auto flex min-h-[calc(100vh-80px)] max-w-7xl flex-col justify-center px-4 py-8 sm:px-6 lg:px-8"> */}
            {/* <div className="overflow-hidden rounded-[36px] border border-white/70 bg-white/80 shadow-[0_25px_90px_-25px_rgba(15,23,42,0.35)] backdrop-blur-xl"> */}
            <div className="bg-linear-to-r from-slate-900 via-blue-900 to-indigo-900 px-6 py-8 text-white sm:px-8 lg:px-10">
                <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
                    <div>
                        <p className="mb-2 inline-flex rounded-full bg-white/15 px-3 py-1 text-sm font-medium text-blue-100">
                            Personal profile
                        </p>
                        <h2 className="text-3xl font-semibold sm:text-4xl">Your profile overview</h2>
                        <p className="mt-2 max-w-2xl text-sm text-slate-300 sm:text-base">
                            A premium, full-page profile experience with quick updates and elegant controls.
                        </p>
                    </div>

                    <div className="rounded-2xl border border-white/15 bg-white/10 px-4 py-3 text-sm text-slate-200">
                        <p className="font-medium text-white">Profile completeness</p>
                        <p className="mt-1 text-2xl font-semibold text-white">{Math.round(completeness)}%</p>
                    </div>
                </div>
            </div>

            <div className="grid gap-8 px-6 py-8 sm:px-8 lg:grid-cols-[1.05fr_0.95fr] lg:px-10 lg:py-10">
                <div className="rounded-[28px] border border-slate-200/80 bg-slate-50/80 p-6 shadow-inner shadow-slate-100">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-semibold uppercase tracking-[0.24em] text-slate-400">Account</p>
                            <h3 className="mt-2 text-2xl font-semibold text-slate-900">{user.name || 'Your name'}</h3>
                        </div>
                        <button
                            onClick={openModal}
                            className="text-black bg-slate-50/80 px-0 py-0 text-md font-semibold transition hover:scale-110 hover:rotate-180 hover:text-green-500"
                        >
                            <MdModeEditOutline/>
                        </button>
                    </div>

                    <div className="mt-8 flex flex-col gap-6 sm:flex-row sm:items-center">
                        <div className="flex h-24 w-24 items-center justify-center overflow-hidden rounded-full border-4 border-white bg-linear-to-br from-blue-500 to-indigo-600 shadow-lg shadow-blue-200">
                            {selectedFile ? (
                                <img src={URL.createObjectURL(selectedFile)} alt="Preview" className="h-full w-full object-cover" />
                            ) : user.profilePicture ? (
                                <img src={user.profilePicture} alt="Profile" className="h-full w-full object-cover" />
                            ) : (
                                <span className="text-3xl font-semibold text-white">{user.name?.charAt(0) || 'U'}</span>
                            )}
                        </div>

                        <div className="space-y-2">
                            <p className="text-sm text-slate-500">Primary contact</p>
                            <p className="text-lg font-semibold text-slate-800">{user.email || 'your@email.com'}</p>
                            <p className="text-sm text-slate-600">{user.contact || 'Add your contact number'}</p>
                        </div>
                    </div>

                    <div className="mt-8 grid gap-4 sm:grid-cols-2">
                        <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
                            <p className="text-sm text-slate-500">Contact number</p>
                            <p className="mt-1 font-semibold text-slate-800">{user.contact || 'Not provided'}</p>
                        </div>
                        <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
                            <p className="text-sm text-slate-500">Hobbies</p>
                            
                            <div className="relative group inline-block">
  <p className="mt-1 font-semibold text-slate-800 cursor-pointer">
    {user?.hobbies
      ? user.hobbies.split(',').slice(0, 3).join(', ') + '...'
      : 'Not provided'}
  </p>

  {/* Tooltip Bubble */}
  {user?.hobbies && (
    <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 hidden group-hover:flex flex-col items-center z-10 w-max max-w-xs">
      <div className="bg-slate-900 text-white text-xs rounded-md py-1.5 px-3 shadow-lg text-center whitespace-normal">
        {user.hobbies}
      </div>
      {/* Tooltip Arrow */}
      <div className="w-2 h-2 -mt-1 bg-slate-900 rotate-45"></div>
    </div>
  )}
</div>

                            {/* <p
  className="mt-1 font-semibold text-slate-800 cursor-pointer"
  title={user?.hobbies || 'Not provided'}
>
  {user?.hobbies
    ? user.hobbies.split(',').slice(0, 3).join(', ') + '...'
    : 'Not provided'}
</p> */}


                        </div>
                    </div>
                    <div className="mt-8 grid gap-4 sm:grid-cols-2">
                        <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
                            <p className="text-sm text-slate-500">Alternate email</p>
                            <p className="mt-1 font-semibold text-slate-800">{user.alternateEmail || 'Not provided'}</p>
                        </div>
                        <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
                            <p className="text-sm text-slate-500">Location</p>
                            <p className="mt-1 font-semibold text-slate-800">{user.location || 'Not provided'}</p>
                        </div>
                    </div>
                    <div className="mt-8 grid gap-4 sm:grid-cols-2">
                        <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
                            <p className="text-sm text-slate-500">Hometown</p>
                            <p className="mt-1 font-semibold text-slate-800">{user.homeTown || 'Not provided'}</p>
                        </div>
                        <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
                            <p className="text-sm text-slate-500">Profession</p>
                            <p className="mt-1 font-semibold text-slate-800">{user.profession || 'Not provided'}</p>
                        </div>
                    </div>
                </div>

                <div className="rounded-[28px] border border-slate-200/80 bg-white p-6 shadow-[0_20px_50px_-20px_rgba(15,23,42,0.25)]">
                    <p className="text-sm font-semibold uppercase tracking-[0.24em] text-slate-400">Quick notes</p>
                    <h3 className="mt-2 text-2xl font-semibold text-slate-900">Keep your profile sharp</h3>
                    <p className="mt-3 text-sm leading-6 text-slate-600">
                        Update your name, contact details, hobbies, or photo whenever you want. The form opens in a clean modal so the experience feels polished and focused.
                    </p>

                    <div className="mt-6 space-y-3">
                        <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                            <p className="text-sm font-semibold text-slate-800">Why this works</p>
                            <p className="mt-1 text-sm text-slate-600">It keeps the page visually calm while giving you a dedicated editing flow.</p>
                        </div>
                        <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                            <p className="text-sm font-semibold text-slate-800">Best for</p>
                            <p className="mt-1 text-sm text-slate-600">Standard websites often use this approach for profile and account settings.</p>
                        </div>
                    </div>
                </div>
            </div>
            {/* </div> */}
            {/* </div> */}

            {isModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 px-4 py-6 backdrop-blur-sm">
                    <div className="w-full max-w-2xl rounded-[28px] border border-slate-200 bg-white p-6 shadow-2xl sm:p-8">
                        <div className="flex items-start justify-between gap-4">
                            <div>
                                <p className="text-sm font-semibold uppercase tracking-[0.24em] text-slate-400">Update details</p>
                                <h3 className="mt-2 text-2xl font-semibold text-slate-900">Edit your profile</h3>
                            </div>
                            <button
                                onClick={() => setIsModalOpen(false)}
                                className="text-xl"
                            >
                                <IoCloseCircleSharp  className='hover:text-red-500 hover:rotate-30 hover:scale-110'/>
                            </button>
                        </div>

                        <form onSubmit={handleUpdateProfile} className="mt-6 space-y-5">
                            <div className="rounded-[22px] border border-slate-200 bg-slate-50 p-4">
                                <label className="mb-2 block text-sm font-medium text-slate-700">Profile photo</label>
                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={(e) => setSelectedFile(e.target.files[0])}
                                    className="text-sm text-slate-600"
                                />
                            </div>

                            <div className="grid gap-4 sm:grid-cols-2">
                                <div>
                                    <label className="mb-2 block text-sm font-medium text-slate-700">Altername email</label>
                                    <input
                                        type="text"
                                        value={formData.alternateEmail}
                                        onChange={(e) => setFormData({ ...formData, alternateEmail: e.target.value })}
                                        className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-700 shadow-sm outline-none transition focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
                                    />
                                </div>

                                <div>
                                    <label className="mb-2 block text-sm font-medium text-slate-700">Location</label>
                                    <input
                                        type="text"
                                        value={formData.location}
                                        onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                                        className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-700 shadow-sm outline-none transition focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
                                    />
                                </div>
                            </div>

                            <div className="grid gap-4 sm:grid-cols-2">
                                <div>
                                    <label className="mb-2 block text-sm font-medium text-slate-700">Hometown</label>
                                    <input
                                        type="text"
                                        value={formData.homeTown}
                                        onChange={(e) => setFormData({ ...formData, homeTown: e.target.value })}
                                        className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-700 shadow-sm outline-none transition focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
                                    />
                                </div>

                                <div>
                                    <label className="mb-2 block text-sm font-medium text-slate-700">Profession</label>
                                    <input
                                        type="text"
                                        value={formData.profession}
                                        onChange={(e) => setFormData({ ...formData, profession: e.target.value })}
                                        className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-700 shadow-sm outline-none transition focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
                                    />
                                </div>
                            </div>

                            <div className="grid gap-4 sm:grid-cols-2">
                                <div>
                                    <label className="mb-2 block text-sm font-medium text-slate-700">Full name</label>
                                    <input
                                        type="text"
                                        value={formData.name}
                                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                        className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-700 shadow-sm outline-none transition focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
                                    />
                                </div>

                                <div>
                                    <label className="mb-2 block text-sm font-medium text-slate-700">Contact number</label>
                                    <input
                                        type="text"
                                        value={formData.contact}
                                        onChange={(e) => setFormData({ ...formData, contact: e.target.value })}
                                        className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-700 shadow-sm outline-none transition focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="mb-2 block text-sm font-medium text-slate-700">Hobbies</label>
                                <input
                                    type="text"
                                    value={formData.hobbies}
                                    onChange={(e) => setFormData({ ...formData, hobbies: e.target.value })}
                                    className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-700 shadow-sm outline-none transition focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
                                    placeholder="Reading, Gaming, Coding"
                                />
                            </div>

                            <div className="flex flex-col gap-3 border-t border-slate-200 pt-4 sm:flex-row sm:justify-end">
                                <button
                                    type="button"
                                    onClick={() => setIsModalOpen(false)}
                                    className="rounded-full border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-100"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="rounded-full bg-linear-to-r from-blue-600 to-indigo-600 px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-blue-200 transition hover:scale-[1.01]"
                                >
                                    Save changes
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Profile;