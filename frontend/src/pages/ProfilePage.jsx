// frontend/src/pages/ProfilePage.jsx
import React, { useState, useEffect } from 'react'; // ¡Asegúrate de importar useEffect!
import { useAuth } from '../context/AuthContext';
import axios from 'axios';
import { FaUserCircle } from 'react-icons/fa'; // Importa este icono para el fallback

const DEFAULT_PROFILE_PICTURE = '/default-avatar.png'; // Asegúrate de tener esta imagen en tu carpeta public/

function ProfilePage() {
    // Obtén 'login' del contexto junto con los demás
    const { user, token, loading, updateProfilePicture, login } = useAuth(); 
    const [selectedFile, setSelectedFile] = useState(null);
    const [uploadMessage, setUploadMessage] = useState('');
    const [previewImage, setPreviewImage] = useState(user?.profilePicture || DEFAULT_PROFILE_PICTURE);
    const [uploading, setUploading] = useState(false);

    // useEffect para sincronizar previewImage con user.profilePicture
    // Esto es crucial para que la imagen se muestre correctamente al cargar/actualizar la página
    useEffect(() => {
        if (!selectedFile) { // Solo actualiza si no hay un archivo nuevo seleccionado para subir
            setPreviewImage(user?.profilePicture || DEFAULT_PROFILE_PICTURE);
        }
    }, [user?.profilePicture, selectedFile]); // Dependencias: el URL de la foto del usuario y si hay un archivo nuevo

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-900 text-yellow-500 text-xl">
                Cargando perfil...
            </div>
        );
    }

    if (!user) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-900 text-red-500 text-xl">
                Acceso denegado. Por favor, inicia sesión para ver tu perfil.
            </div>
        );
    }

    const handleFileChange = (event) => {
        const file = event.target.files[0];
        if (file) {
            setSelectedFile(file);
            // Muestra una vista previa del archivo seleccionado
            setPreviewImage(URL.createObjectURL(file)); 
            setUploadMessage('');
        } else {
            setSelectedFile(null);
            // Si no hay archivo seleccionado, vuelve a la foto actual del usuario o al default
            setPreviewImage(user?.profilePicture || DEFAULT_PROFILE_PICTURE); 
        }
    };

    const handleUpload = async () => {
        if (!selectedFile) {
            setUploadMessage('Por favor, selecciona una imagen para subir.');
            return;
        }

        setUploading(true);
        setUploadMessage('Subiendo imagen...');

        const formData = new FormData();
        formData.append('profilePicture', selectedFile); // 'profilePicture' debe coincidir con el nombre del campo en Multer

        try {
            const response = await axios.post('http://localhost:3000/api/profile/upload-picture', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    'Authorization': `Bearer ${token}`
                }
            });
            
            // **** ESTA ES LA LÍNEA CLAVE PARA LA PERSISTENCIA ****
            // Si el backend devuelve un 'token' actualizado (con la nueva URL de la foto),
            // usa la función 'login' para guardar ese nuevo token en localStorage.
            if (response.data.token) { 
                login(response.data.token); 
            } else {
                // Si por alguna razón tu backend NO devuelve un nuevo token (lo cual debería hacer),
                // al menos actualizamos el estado del contexto. Pero NO persistirá en este caso.
                updateProfilePicture(response.data.profilePictureUrl); 
            }
            
            setUploadMessage('Foto de perfil actualizada exitosamente.');
            setSelectedFile(null); // Limpia la selección de archivo después de subir
            // El useEffect anterior se encargará de que `previewImage` refleje la nueva foto del usuario
        } catch (error) {
            console.error('Error al subir la foto:', error);
            if (error.response && error.response.data && error.response.data.message) {
                setUploadMessage(`Error: ${error.response.data.message}`);
            } else {
                setUploadMessage('Error al subir la foto de perfil.');
            }
            // Si hay un error, revierte la previsualización a la foto de perfil actual del usuario
            setPreviewImage(user?.profilePicture || DEFAULT_PROFILE_PICTURE); 
        } finally {
            setUploading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-white p-6">
            <div className="container mx-auto bg-white dark:bg-gray-800 rounded-lg shadow-xl p-8 max-w-md">
                <h1 className="text-3xl font-bold text-center mb-8">Mi Perfil</h1>

                <div className="flex flex-col items-center mb-6">
                    {/* Muestra la foto de perfil o el icono por defecto */}
                    {previewImage ? (
                        <img
                            src={previewImage}
                            alt="Foto de perfil"
                            className="w-32 h-32 rounded-full object-cover border-4 border-yellow-500 mb-4 shadow-lg"
                            onError={(e) => { e.target.onerror = null; e.target.src = DEFAULT_PROFILE_PICTURE; }} // Fallback si la imagen no carga
                        />
                    ) : (
                        <FaUserCircle className="w-32 h-32 text-gray-400 dark:text-gray-500 mb-4" />
                    )}
                    
                    <h2 className="text-2xl font-semibold mb-2">{user.username}</h2>
                    <p className="text-gray-600 dark:text-gray-300 mb-1">{user.email}</p>
                    <p className="text-gray-600 dark:text-gray-300 capitalize">Rol: <span className="font-medium text-blue-600 dark:text-blue-400">{user.role}</span></p>
                </div>

                <div className="mt-8 pt-6 border-t border-gray-200 dark:border-gray-700">
                    <h3 className="text-xl font-semibold mb-4 text-center">Cambiar Foto de Perfil</h3>
                    <input
                        type="file"
                        accept="image/*"
                        onChange={handleFileChange}
                        className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 dark:file:bg-blue-900 dark:file:text-blue-200 dark:hover:file:bg-blue-800 cursor-pointer"
                    />
                    {selectedFile && (
                        <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">Archivo seleccionado: {selectedFile.name}</p>
                    )}
                    {uploadMessage && (
                        <p className={`mt-4 text-center text-sm ${uploadMessage.includes('Error') ? 'text-red-500' : 'text-green-500'}`}>
                            {uploadMessage}
                        </p>
                    )}
                    <button
                        onClick={handleUpload}
                        disabled={!selectedFile || uploading}
                        className={`mt-6 w-full py-3 rounded-lg text-white font-semibold transition duration-300 ${!selectedFile || uploading ? 'bg-gray-400 cursor-not-allowed' : 'bg-green-600 hover:bg-green-700'}`}
                    >
                        {uploading ? 'Subiendo...' : 'Subir Nueva Foto'}
                    </button>
                </div>
            </div>
        </div>
    );
}

export default ProfilePage;