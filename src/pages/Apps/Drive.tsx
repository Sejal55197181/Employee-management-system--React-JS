// import React, { useState, useRef, useEffect } from 'react';
// import axios from 'axios';

// type ServiceType = 'Google Docs' | 'MS Office Online' | 'Office 365' | 'Desktop applications';

// interface Folder {
//     id: number;
//     name: string;
//     type: string;
//     userId: number;
//     itemType: string;
//     category?: string;
//     createdAt: string;
//     dateChanged: string;
//     size: string;
//     shared?: boolean;
// }

// interface RecycleBinItem {
//     id: number;
//     name: string;
//     dateDeleted: string;
//     size: string;
//     originalPath: string;
// }

// const Drive = () => {
//     const [selectedItems, setSelectedItems] = useState<number>(0);
//     const [isAddDropdownOpen, setIsAddDropdownOpen] = useState(false);
//     const [activeSubmenu, setActiveSubmenu] = useState<ServiceType | null>(null);
//     const [showDocumentModal, setShowDocumentModal] = useState(false);
//     const [selectedService, setSelectedService] = useState<ServiceType | null>(null);
//     const [selectedDocType, setSelectedDocType] = useState('');
//     const [isSettingsDropdownOpen, setIsSettingsDropdownOpen] = useState(false);
//     const fileInputRef = useRef<HTMLInputElement>(null);
//     const [selectedFile, setSelectedFile] = useState<File | null>(null);
//     const [currentView, setCurrentView] = useState<'my-drive' | 'drive-cleanup' | 'more' | 'recycle-bin'>('my-drive');
//     const [searchTerm, setSearchTerm] = useState('');
//     const [sortOption, setSortOption] = useState('Last Modified');
//     const [isSortDropdownOpen, setIsSortDropdownOpen] = useState(false);
//     const [isMoreDropdownOpen, setIsMoreDropdownOpen] = useState(false);
//     const [folders, setFolders] = useState<Folder[]>([]);
//     const [notification, setNotification] = useState<{ type: 'success' | 'error', message: string } | null>(null);
//     const [recycleBinItems, setRecycleBinItems] = useState<RecycleBinItem[]>([]);
//     const [sortBy, setSortBy] = useState<'date_deleted' | 'date_changed' | 'id' | 'name' | 'size' | 'reverse' | 'mixed'>('date_deleted');

//     const dropdownRef = useRef<HTMLDivElement>(null);

//     const [showResetConfirm, setShowResetConfirm] = useState(false);
//     const [isConfigureMode, setIsConfigureMode] = useState(false);

//     const [showFolderModal, setShowFolderModal] = useState(false);
//     const [newFolderName, setNewFolderName] = useState('');

//     const [totalUsed, setTotalUsed] = useState('0.65 Kb');
//     const [totalFiles, setTotalFiles] = useState(1);
//     const [isScanning, setIsScanning] = useState(false);
//     const [cleanupSize, setCleanupSize] = useState('0 b');

//     const [showRecycleBinSettings, setShowRecycleBinSettings] = useState(false);
//     const [showSettingsModal, setShowSettingsModal] = useState(false);

//     const showNotification = (type: 'success' | 'error', message: string) => {
//         setNotification({ type, message });
//         setTimeout(() => setNotification(null), 3000);
//     };

//     // Close dropdown when clicking outside
//     useEffect(() => {
//         const handleClickOutside = (event: MouseEvent) => {
//             if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
//                 setIsAddDropdownOpen(false);
//                 setActiveSubmenu(null);
//             }
//         };

//         document.addEventListener('mousedown', handleClickOutside);
//         return () => document.removeEventListener('mousedown', handleClickOutside);
//     }, []);

//     const handleAddItem = async (itemType: string, service?: ServiceType) => {
//         if (service) {
//             try {
//                 const token = localStorage.getItem('token');
//                 if (!token) {
//                     showNotification('error', 'Please login to create documents');
//                     return;
//                 }

//                 const extension = itemType === 'Document' ? '.docx' : 
//                                 itemType === 'Spreadsheet' ? '.xlsx' : 
//                                 itemType === 'Presentation' ? '.pptx' : '';

//                 const fileName = `New ${itemType}${extension}`;
//                 const category = service.toLowerCase().replace(' ', '_');

//                 const response = await axios.post('http://localhost:5000/api/folders', {
//                     name: fileName,
//                     type: currentView,
//                     itemType: 'file',
//                     category: category
//                 }, {
//                     headers: {
//                         'Authorization': `Bearer ${token}`
//                     }
//                 });

//                 if (response.data) {
//                     // Refresh folders list
//                     const foldersResponse = await axios.get('http://localhost:5000/api/folders', {
//                         headers: {
//                             'Authorization': `Bearer ${token}`
//                         }
//                     });
//                     setFolders(foldersResponse.data);

//                     showNotification('success', `Created new ${itemType} with ${service}`);
//                 }
//             } catch (error) {
//                 console.error('Error creating document:', error);
//                 showNotification('error', 'Failed to create document');
//             }
//             setIsAddDropdownOpen(false);
//         } else {
//             if (itemType === 'File') {
//                 fileInputRef.current?.click();
//             } else if (itemType === 'Folder') {
//                 setShowFolderModal(true);
//             }
//         }
//         setIsAddDropdownOpen(false);
//     };

//     const handleCreateFolder = async () => {
//         if (!newFolderName.trim()) {
//             showNotification('error', 'Please enter a folder name');
//             return;
//         }

//         try {
//             const token = localStorage.getItem('token');
//             if (!token) {
//                 showNotification('error', 'Please login to create folders');
//                 return;
//             }

//             const response = await axios.post('http://localhost:5000/api/folders', {
//                 name: newFolderName,
//                 type: currentView,
//                 itemType: 'folder'
//             }, {
//                 headers: {
//                     'Authorization': `Bearer ${token}`
//                 }
//             });

//             if (response.data) {
//                 const foldersResponse = await axios.get('http://localhost:5000/api/folders', {
//                     headers: {
//                         'Authorization': `Bearer ${token}`
//                     }
//                 });
//                 setFolders(foldersResponse.data);
//                 showNotification('success', 'Folder created successfully');
//             }
//         } catch (error) {
//             console.error('Error creating folder:', error);
//             showNotification('error', 'Failed to create folder');
//         }

//         setShowFolderModal(false);
//         setNewFolderName('');
//     };

//     const handleDelete = async (itemId: number) => {
//         try {
//             const token = localStorage.getItem('token');
//             if (!token) {
//                 showNotification('error', 'Please login to delete items');
//                 return;
//             }

//             // Move the item to recycle bin
//             const itemToDelete = folders.find(f => f.id === itemId);
//             if (itemToDelete) {
//                 const recycleBinItem: RecycleBinItem = {
//                     id: itemToDelete.id,
//                     name: itemToDelete.name,
//                     dateDeleted: new Date().toISOString(),
//                     size: '1 MB', // You might want to get actual file size
//                     originalPath: itemToDelete.type
//                 };
//                 setRecycleBinItems(prev => [...prev, recycleBinItem]);
//             }

//             // Remove from current view
//             setFolders(folders.filter(f => f.id !== itemId));
//             showNotification('success', 'Item moved to recycle bin');
//         } catch (error) {
//             console.error('Error deleting item:', error);
//             showNotification('error', 'Failed to delete item');
//         }
//     };

//     const handleScan = async () => {
//         setIsScanning(true);
//         // Simulate scanning process
//         setTimeout(() => {
//             setIsScanning(false);
//             setCleanupSize('0 b');
//         }, 2000);
//     };

//     const handleAssignPermissions = async () => {
//         try {
//             const token = localStorage.getItem('token');
//             if (!token) {
//                 showNotification('error', 'Please login to manage permissions');
//                 return;
//             }

//             const response = await axios.post('http://localhost:5000/api/permissions/assign', {
//                 driveType: currentView
//             }, {
//                 headers: { 'Authorization': `Bearer ${token}` }
//             });

//             if (response.data.success) {
//                 showNotification('success', 'Permissions updated successfully');
//             }
//         } catch (error) {
//             console.error('Error assigning permissions:', error);
//             showNotification('error', 'Failed to update permissions');
//         }
//         setShowRecycleBinSettings(false);
//     };

//     const handleConfigureBusinessProcesses = async () => {
//         try {
//             const token = localStorage.getItem('token');
//             if (!token) {
//                 showNotification('error', 'Please login to configure processes');
//                 return;
//             }

//             const response = await axios.post('http://localhost:5000/api/processes/configure', {
//                 driveType: currentView
//             }, {
//                 headers: { 'Authorization': `Bearer ${token}` }
//             });

//             if (response.data.success) {
//                 showNotification('success', 'Business processes configured successfully');
//             }
//         } catch (error) {
//             console.error('Error configuring processes:', error);
//             showNotification('error', 'Failed to configure business processes');
//         }
//         setShowRecycleBinSettings(false);
//     };

//     const handleNetworkDrive = async () => {
//         try {
//             const token = localStorage.getItem('token');
//             if (!token) {
//                 showNotification('error', 'Please login to access network drive');
//                 return;
//             }

//             const response = await axios.post('http://localhost:5000/api/network/connect', {
//                 driveType: currentView
//             }, {
//                 headers: { 'Authorization': `Bearer ${token}` }
//             });

//             if (response.data.success) {
//                 showNotification('success', 'Connected to network drive successfully');
//             }
//         } catch (error) {
//             console.error('Error connecting to network drive:', error);
//             showNotification('error', 'Failed to connect to network drive');
//         }
//         setShowRecycleBinSettings(false);
//     };

//     const handleDocumentSettings = async () => {
//         try {
//             const token = localStorage.getItem('token');
//             if (!token) {
//                 showNotification('error', 'Please login to modify document settings');
//                 return;
//             }

//             const response = await axios.post('http://localhost:5000/api/documents/settings', {
//                 driveType: currentView
//             }, {
//                 headers: { 'Authorization': `Bearer ${token}` }
//             });

//             if (response.data.success) {
//                 showNotification('success', 'Document settings updated successfully');
//             }
//         } catch (error) {
//             console.error('Error updating document settings:', error);
//             showNotification('error', 'Failed to update document settings');
//         }
//         setShowRecycleBinSettings(false);
//     };

//     const handleDriveCleanup = async () => {
//         try {
//             const token = localStorage.getItem('token');
//             if (!token) {
//                 showNotification('error', 'Please login to access drive cleanup');
//                 return;
//             }

//             const response = await axios.post('http://localhost:5000/api/drive/cleanup', {
//                 driveType: currentView
//             }, {
//                 headers: { 'Authorization': `Bearer ${token}` }
//             });

//             if (response.data.success) {
//                 showNotification('success', 'Drive cleanup successfully');
//             }
//         } catch (error) {
//             console.error('Error accessing drive cleanup:', error);
//             showNotification('error', 'Failed to access drive cleanup');
//         }
//     };

//     const menuItems = [
//         { type: 'File', hasSubmenu: false },
//         { type: 'Folder', hasSubmenu: false },
//         { 
//             type: 'Google Docs' as ServiceType,
//             hasSubmenu: true,
//             submenu: ['Document', 'Spreadsheet', 'Presentation']
//         },
//         { 
//             type: 'MS Office Online' as ServiceType,
//             hasSubmenu: true,
//             submenu: ['Document', 'Spreadsheet', 'Presentation']
//         },
//         { 
//             type: 'Office 365' as ServiceType,
//             hasSubmenu: true,
//             submenu: ['Document', 'Spreadsheet', 'Presentation']
//         },
//         { 
//             type: 'Desktop applications' as ServiceType,
//             hasSubmenu: true,
//             submenu: ['Document', 'Spreadsheet', 'Presentation']
//         }
//     ];

//     const renderDropdown = () => {
//         if (!isAddDropdownOpen) return null;

//         return (
//             <div className="absolute top-full left-0 mt-1 w-48 bg-[#1b2e4b] rounded-md shadow-lg">
//                 {menuItems.map((item, index) => (
//                     <div 
//                         key={index}
//                         className="relative group"
//                     >
//                         <button
//                             className="flex items-center justify-between w-full px-4 py-2 text-sm text-gray-300 hover:bg-[#283c5d]"
//                             onClick={() => !item.hasSubmenu && handleAddItem(item.type)}
//                             onMouseEnter={() => item.hasSubmenu && setActiveSubmenu(item.type as ServiceType)}
//                             onMouseLeave={() => setActiveSubmenu(null)}
//                         >
//                             {item.type}
//                             {item.hasSubmenu && (
//                                 <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none">
//                                     <path d="M9 5L16 12L9 19" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
//                                 </svg>
//                             )}
//                         </button>
//                         {item.hasSubmenu && activeSubmenu === item.type && (
//                             <div 
//                                 className="absolute right-full top-0 w-48 bg-[#1b2e4b] rounded-md shadow-lg"
//                                 style={{ marginRight: '2px' }}
//                                 onMouseEnter={() => setActiveSubmenu(item.type as ServiceType)}
//                                 onMouseLeave={() => setActiveSubmenu(null)}
//                             >
//                                 {item.submenu?.map((subItem, subIndex) => (
//                                     <button
//                                         key={subIndex}
//                                         className="block w-full text-left px-4 py-2 text-sm text-gray-300 hover:bg-[#283c5d]"
//                                         onClick={() => handleAddItem(subItem, item.type as ServiceType)}
//                                     >
//                                         {subItem}
//                                     </button>
//                                 ))}
//                             </div>
//                         )}
//                     </div>
//                 ))}
//             </div>
//         );
//     };

//     const renderDropdownMenu = (items: { label: string }[], isOpen: boolean, onClose: () => void) => {
//         if (!isOpen) return null;

//         return (
//             <div className="absolute z-50 mt-2 w-64 rounded-md bg-[#1b2e4b] shadow-lg border border-[#3b3f5c]">
//                 <div className="py-1">
//                     {items.map((item, index) => (
//                         <button
//                             key={index}
//                             className="block w-full text-left px-4 py-2 text-sm ${sortOption === option ? 'text-primary font-medium' : 'text-gray-300 hover:bg-[#283c5d]'}}"
//                             onClick={() => {
//                                 onClose();
//                                 // Handle item click
//                                 console.log('Clicked:', item.label);
//                             }}
//                         >
//                             {item.label}
//                         </button>
//                     ))}
//                 </div>
//             </div>
//         );
//     };

//     const renderMoreDropdown = () => {
//         if (!isMoreDropdownOpen) return null;

//         return (
//             <div className="absolute right-0 mt-2 w-48 bg-[#1b2e4b] rounded shadow-lg z-50 border border-[#283c5d]">
//                 <div className="py-1">
//                     <button
//                         onClick={() => {
//                             setIsConfigureMode(!isConfigureMode);
//                         }}
//                         className={`w-full text-left px-4 py-2 text-sm flex items-center ${
//                             isConfigureMode 
//                                 ? 'bg-[#e6ffe6] text-green-700 hover:bg-[#d1ffd1]' 
//                                 : 'bg-[#283c5d] text-gray-300 hover:bg-[#374e6e] hover:text-white'
//                         }`}
//                     >
//                         <div className="flex items-center">
//                             {isConfigureMode ? (
//                                 <svg className="w-4 h-4 mr-2" viewBox="0 0 24 24" fill="none" stroke="currentColor">
//                                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
//                                 </svg>
//                             ) : (
//                                 <svg className="w-4 h-4 mr-2" viewBox="0 0 24 24" fill="none" stroke="currentColor">
//                                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
//                                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
//                                 </svg>
//                             )}
//                             {isConfigureMode ? 'Finish customization  ' : 'Configure menu'}
//                         </div>
//                     </button>
//                     <button
//                         onClick={() => {
//                             setShowResetConfirm(true);
//                             setIsMoreDropdownOpen(false);
//                         }}
//                         className="w-full text-left px-4 py-2 text-sm text-gray-300 hover:bg-[#374e6e] hover:text-white"
//                     >
//                         Reset menu
//                     </button>
//                 </div>
//             </div>
//         );
//     };

//     const renderSortDropdown = () => {
//         if (!isSortDropdownOpen) return null;

//         return (
//             <div className="absolute z-50 mt-2 w-64 rounded-md bg-[#1b2e4b] shadow-lg border border-[#3b3f5c]">
//                 <div className="py-1">
//                     {['Last Modified', 'Name', 'Size'].map((option, index) => (
//                         <button
//                             key={index}
//                             className={`block w-full text-left px-4 py-2 text-sm ${sortOption === option ? 'text-primary font-medium' : 'text-gray-300 hover:bg-[#283c5d]'}`}
//                             onClick={() => {
//                                 setSortOption(option);
//                                 setIsSortDropdownOpen(false);
//                             }}
//                         >
//                             {option}
//                         </button>
//                     ))}
//                 </div>
//             </div>
//         );
//     };

//     const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//         if (e.target.files) {
//             setSelectedFile(e.target.files[0]);
//         }
//     };

//     const handleViewChange = (view: 'my-drive' | 'drive-cleanup' | 'more' | 'recycle-bin') => {
//         setCurrentView(view);
//     };

//     const renderDocumentModal = () => {
//         if (!showDocumentModal || !selectedService) return null;

//         const serviceColors: Record<ServiceType, string> = {
//             'Google Docs': 'bg-[#8fce00] hover:bg-[#7fb800]',
//             'MS Office Online': 'bg-[#00a1f1] hover:bg-[#008cd9]',
//             'Office 365': 'bg-[#d83b01] hover:bg-[#bf3501]',
//             'Desktop applications': 'bg-[#6366f1] hover:bg-[#4f46e5]'
//         };

//         return (
//             <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
//                 <div className="bg-white rounded-lg w-96">
//                     <div className="p-4 border-b">
//                         <h2 className="text-lg font-medium">Create {selectedDocType.toLowerCase()} with {selectedService}</h2>
//                     </div>
//                     <div className="p-6">
//                         <p className="text-sm text-gray-600">
//                             {selectedService === 'Desktop applications' ? (
//                                 'Choose a desktop application to create your document. The file will be saved locally.'
//                             ) : (
//                                 'You are currently editing a new document. Once finished, click "Save" to add it to your drive.'
//                             )}
//                         </p>
//                         {selectedService === 'Desktop applications' && (
//                             <div className="mt-4 space-y-2">
//                                 <button className="w-full text-left p-2 hover:bg-gray-100 rounded">
//                                     Microsoft Office
//                                 </button>
//                                 <button className="w-full text-left p-2 hover:bg-gray-100 rounded">
//                                     LibreOffice
//                                 </button>
//                                 <button className="w-full text-left p-2 hover:bg-gray-100 rounded">
//                                     Other Application...
//                                 </button>
//                             </div>
//                         )}
//                     </div>
//                     <div className="flex justify-end gap-2 p-4 border-t">
//                         <button
//                             onClick={() => setShowDocumentModal(false)}
//                             className="px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-md"
//                         >
//                             Cancel
//                         </button>
//                         <button
//                             onClick={() => setShowDocumentModal(false)}
//                             className={`px-4 py-2 text-sm font-medium text-white ${serviceColors[selectedService]} rounded-md`}
//                         >
//                             {selectedService === 'Desktop applications' ? 'Open' : 'Save'}
//                         </button>
//                     </div>
//                 </div>
//             </div>
//         );
//     };

//     const renderFolderModal = () => {
//         if (!showFolderModal) return null;

//         return (
//             <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
//                 <div className="bg-[#1b2e4b] rounded-lg shadow-xl w-96 p-6">
//                     <div className="flex justify-between items-center mb-4">
//                         <h3 className="text-xl font-semibold text-gray-300">Create folder</h3>
//                         <button
//                             onClick={() => setShowFolderModal(false)}
//                             className="text-gray-400 hover:text-gray-300"
//                         >
//                             <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//                                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
//                             </svg>
//                         </button>
//                     </div>
//                     <div className="mb-4">
//                         <label className="block text-gray-400 text-sm font-medium mb-2">
//                             Name
//                         </label>
//                         <input
//                             type="text"
//                             value={newFolderName}
//                             onChange={(e) => setNewFolderName(e.target.value)}
//                             className="w-full px-3 py-2 bg-[#283c5d] border border-gray-600 rounded-md text-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//                             placeholder="Enter folder name"
//                         />
//                     </div>
//                     <div className="flex justify-end space-x-3">
//                         <button
//                             onClick={() => setShowFolderModal(false)}
//                             className="px-4 py-2 text-sm font-medium text-gray-300 hover:text-white bg-gray-700 hover:bg-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-500"
//                         >
//                             Cancel
//                         </button>
//                         <button
//                             onClick={handleCreateFolder}
//                             className="px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
//                         >
//                             Create
//                         </button>
//                     </div>
//                 </div>
//             </div>
//         );
//     };

//     const renderRecycleBinSettings = () => {
//         if (!showRecycleBinSettings) return null;

//         return (
//             <div className="absolute right-0 mt-1 w-72 bg-[#1b2e4b] rounded-md shadow-lg z-50">
//                 <div className="py-1">
//                     <div className="px-4 py-2 text-xs text-gray-400 border-b border-gray-700">
//                         Files deleted to the Recycle Bin are kept for 30 days
//                     </div>
//                     <button 
//                         onClick={handleAssignPermissions}
//                         className="w-full text-left px-4 py-2 text-sm text-gray-300 hover:bg-[#283c5d] hover:text-white flex items-center"
//                     >
//                         <svg className="w-4 h-4 mr-2" viewBox="0 0 24 24" fill="none" stroke="currentColor">
//                             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8V7a4 4 0 00-8 0v4h8z" />
//                         </svg>
//                         Assign permissions
//                     </button>
//                     <button 
//                         onClick={handleConfigureBusinessProcesses}
//                         className="w-full text-left px-4 py-2 text-sm text-gray-300 hover:bg-[#283c5d] hover:text-white flex items-center"
//                     >
//                         <svg className="w-4 h-4 mr-2" viewBox="0 0 24 24" fill="none" stroke="currentColor">
//                             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
//                         </svg>
//                         Configure business processes
//                     </button>
//                     <button 
//                         onClick={handleNetworkDrive}
//                         className="w-full text-left px-4 py-2 text-sm text-gray-300 hover:bg-[#283c5d] hover:text-white flex items-center"
//                     >
//                         <svg className="w-4 h-4 mr-2" viewBox="0 0 24 24" fill="none" stroke="currentColor">
//                             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4m0 5c0 2.21-3.582 4-8 4s-8-1.79-8-4" />
//                         </svg>
//                         Network Drive
//                     </button>
//                     <button 
//                         onClick={handleDocumentSettings}
//                         className="w-full text-left px-4 py-2 text-sm text-gray-300 hover:bg-[#283c5d] hover:text-white flex items-center"
//                     >
//                         <svg className="w-4 h-4 mr-2" viewBox="0 0 24 24" fill="none" stroke="currentColor">
//                             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
//                         </svg>
//                         Settings for working with documents
//                     </button>
//                     <button 
//                         onClick={() => setShowSettingsModal(true)}
//                         className="w-full text-left px-4 py-2 text-sm text-gray-300 hover:bg-[#283c5d] hover:text-white flex items-center"
//                     >
//                         <svg className="w-4 h-4 mr-2" viewBox="0 0 24 24" fill="none" stroke="currentColor">
//                             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
//                         </svg>
//                         Drive Cleanup
//                     </button>
//                 </div>
//             </div>
//         );
//     };

//     const renderResetConfirm = () => {
//         if (!showResetConfirm) return null;

//         return (
//             <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
//                 <div className="bg-[#1b2e4b] rounded-lg p-6 max-w-sm w-full mx-4">
//                     <div className="flex justify-between items-center mb-4">
//                         <h3 className="text-lg font-medium text-gray-300">Reset menu</h3>
//                         <button 
//                             onClick={() => setShowResetConfirm(false)} 
//                             className="text-gray-400 hover:text-gray-300"
//                         >
//                             <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor">
//                                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
//                             </svg>
//                         </button>
//                     </div>
//                     <p className="text-gray-400 mb-6">Reset menu to default view?</p>
//                     <div className="flex justify-end space-x-3">
//                         <button
//                             className="px-4 py-2 bg-[#4361ee] text-white rounded hover:bg-[#3651d4] transition-colors"
//                             onClick={() => {
//                                 setShowResetConfirm(false);
//                                 setIsConfigureMode(false);
//                             }}
//                         >
//                             Reset
//                         </button>
//                         <button
//                             className="px-4 py-2 text-gray-300 hover:text-white hover:bg-[#283c5d] rounded transition-colors"
//                             onClick={() => setShowResetConfirm(false)}
//                         >
//                             Cancel
//                         </button>
//                     </div>
//                 </div>
//             </div>
//         );
//     };

//     const renderRecycleBin = () => {
//         if (currentView !== 'recycle-bin') return null;

//         const sortedItems = [...recycleBinItems].sort((a, b) => {
//             switch (sortBy) {
//                 case 'date_deleted':
//                     return new Date(b.dateDeleted).getTime() - new Date(a.dateDeleted).getTime();
//                 case 'name':
//                     return a.name.localeCompare(b.name);
//                 case 'size':
//                     return parseFloat(b.size) - parseFloat(a.size);
//                 case 'reverse':
//                     return new Date(a.dateDeleted).getTime() - new Date(b.dateDeleted).getTime();
//                 default:
//                     return 0;
//             }
//         });

//         return (
//             <div className="p-4">
//                 <div className="flex justify-between items-center mb-4">
//                     <div className="text-sm text-gray-400">
//                         Files deleted to the Recycle Bin are kept for 30 days
//                     </div>
//                     <div className="flex items-center space-x-2">
//                         <button 
//                             className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
//                             onClick={() => setRecycleBinItems([])}
//                         >
//                             EMPTY RECYCLE BIN
//                         </button>
//                         <div className="relative">
//                             <button
//                                 onClick={() => setShowRecycleBinSettings(!showRecycleBinSettings)}
//                                 className="p-2 hover:bg-[#283c5d] rounded-full"
//                             >
//                                 <svg className="w-5 h-5 text-gray-400" viewBox="0 0 24 24" fill="none" stroke="currentColor">
//                                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82V9a1.65 1.65 0 0 0 1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z" />
//                                     <circle cx="12" cy="12" r="3" />
//                                 </svg>
//                             </button>
//                             {renderRecycleBinSettings()}
//                         </div>
//                     </div>
//                 </div>

//                 {sortedItems.length === 0 ? (
//                     <div className="text-center py-20">
//                         <div className="mb-4">
//                             <svg className="w-20 h-20 mx-auto text-gray-400" viewBox="0 0 24 24" fill="none">
//                                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
//                             </svg>
//                         </div>
//                         <h2 className="text-xl font-semibold mb-2">Recycle Bin is Empty</h2>
//                         <p className="text-gray-500">No items have been deleted</p>
//                     </div>
//                 ) : (
//                     <div className="bg-white rounded-lg shadow">
//                         <table className="w-full">
//                             <thead className="bg-gray-50">
//                                 <tr>
//                                     <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Name</th>
//                                     <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Original Location</th>
//                                     <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date Deleted</th>
//                                     <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Size</th>
//                                     <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Actions</th>
//                                 </tr>
//                             </thead>
//                             <tbody className="divide-y divide-gray-200">
//                                 {sortedItems.map((item) => (
//                                     <tr key={item.id} className="hover:bg-gray-50">
//                                         <td className="px-6 py-4 text-sm text-gray-900">{item.name}</td>
//                                         <td className="px-6 py-4 text-sm text-gray-500">{item.originalPath}</td>
//                                         <td className="px-6 py-4 text-sm text-gray-500">
//                                             {new Date(item.dateDeleted).toLocaleDateString()}
//                                         </td>
//                                         <td className="px-6 py-4 text-sm text-gray-500">{item.size}</td>
//                                         <td className="px-6 py-4 text-right text-sm font-medium">
//                                             <button 
//                                                 className="text-blue-600 hover:text-blue-900 mr-3"
//                                                 onClick={() => {
//                                                     // Restore item logic
//                                                     setRecycleBinItems(items => items.filter(i => i.id !== item.id));
//                                                 }}
//                                             >
//                                                 Restore
//                                             </button>
//                                             <button 
//                                                 className="text-red-600 hover:text-red-900"
//                                                 onClick={() => {
//                                                     // Permanent delete logic
//                                                     setRecycleBinItems(items => items.filter(i => i.id !== item.id));
//                                                 }}
//                                             >
//                                                 Delete
//                                             </button>
//                                         </td>
//                                     </tr>
//                                 ))}
//                             </tbody>
//                         </table>
//                     </div>
//                 )}
//             </div>
//         );
//     };

//     const renderDriveCleanup = () => {
//         if (currentView !== 'drive-cleanup') return null;

//         return (
//             <div className="p-6">
//                 <div className="bg-[#1b2e4b] rounded-md p-6">
//                     <div className="mb-8">
//                         <h2 className="text-xl text-white font-medium mb-2">My Drive</h2>
//                         <div className="text-sm text-gray-400">
//                             Total used: {totalUsed} &nbsp;&nbsp;&nbsp; Total files: {totalFiles}
//                         </div>
//                     </div>

//                     {/* Progress Bar */}
//                     <div className="w-full h-2 bg-[#283c5d] rounded mb-8">
//                         <div 
//                             className="h-full bg-[#4361ee] rounded" 
//                             style={{ width: '15%' }}
//                         />
//                     </div>

//                     {/* Drive Usage Summary */}
//                     <div className="mb-8">
//                         <div className="flex items-center text-sm text-gray-400 mb-2">
//                             <div className="w-3 h-3 rounded-full bg-[#4361ee] mr-2" />
//                             Documents
//                         </div>
//                     </div>

//                     {/* Safe Cleanup Section */}
//                     <div className="text-center py-12 border-t border-[#283c5d]">
//                         <h3 className="text-2xl font-light text-white mb-6">Safe Cleanup</h3>
//                         <div className="text-6xl font-light text-white mb-6">
//                             {cleanupSize}
//                         </div>
//                         <p className="text-sm text-gray-400 mb-6">
//                             {isScanning ? 'Scanning...' : 'No files found for safe cleanup'}
//                         </p>
//                         <button
//                             className="px-6 py-2 bg-[#4361ee] text-white rounded hover:bg-[#2e4eed] transition-colors"
//                             onClick={handleScan}
//                             disabled={isScanning}
//                         >
//                             {isScanning ? (
//                                 <div className="flex items-center">
//                                     <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
//                                         <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
//                                         <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
//                                     </svg>
//                                     SCANNING...
//                                 </div>
//                             ) : (
//                                 'REPEAT SCAN'
//                             )}
//                         </button>
//                     </div>

//                     {/* Expert Mode Toggle */}
//                     <div className="flex justify-end mt-4">
//                         <div className="flex items-center">
//                             <span className="text-sm text-gray-400 mr-2">Expert mode</span>
//                             <label className="relative inline-flex items-center cursor-pointer">
//                                 <input type="checkbox" value="" className="sr-only peer" />
//                                 <div className="w-11 h-6 bg-[#283c5d] rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#4361ee]"></div>
//                             </label>
//                         </div>
//                     </div>
//                 </div>
//             </div>
//         );
//     };

//     const renderSettingsDropdown = () => {
//         if (!isSettingsDropdownOpen) return null;

//         return (
//             <div className="absolute right-0 mt-1 w-72 bg-[#1b2e4b] rounded-md shadow-lg z-50">
//                 <div className="py-1">
//                     <button 
//                         onClick={handleAssignPermissions}
//                         className="w-full text-left px-4 py-2 text-sm text-gray-300 hover:bg-[#283c5d] hover:text-white flex items-center"
//                     >
//                         <svg className="w-4 h-4 mr-2" viewBox="0 0 24 24" fill="none" stroke="currentColor">
//                             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8V7a4 4 0 00-8 0v4h8z" />
//                         </svg>
//                         Assign permissions
//                     </button>
//                     <button 
//                         onClick={handleConfigureBusinessProcesses}
//                         className="w-full text-left px-4 py-2 text-sm text-gray-300 hover:bg-[#283c5d] hover:text-white flex items-center"
//                     >
//                         <svg className="w-4 h-4 mr-2" viewBox="0 0 24 24" fill="none" stroke="currentColor">
//                             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
//                         </svg>
//                         Configure business processes
//                     </button>
//                     <button 
//                         onClick={handleNetworkDrive}
//                         className="w-full text-left px-4 py-2 text-sm text-gray-300 hover:bg-[#283c5d] hover:text-white flex items-center"
//                     >
//                         <svg className="w-4 h-4 mr-2" viewBox="0 0 24 24" fill="none" stroke="currentColor">
//                             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4m0 5c0 2.21-3.582 4-8 4s-8-1.79-8-4" />
//                         </svg>
//                         Network Drive
//                     </button>
//                     <button 
//                         onClick={handleDocumentSettings}
//                         className="w-full text-left px-4 py-2 text-sm text-gray-300 hover:bg-[#283c5d] hover:text-white flex items-center"
//                     >
//                         <svg className="w-4 h-4 mr-2" viewBox="0 0 24 24" fill="none" stroke="currentColor">
//                             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
//                         </svg>
//                         Settings for working with documents
//                     </button>
//                     <button 
//                         onClick={handleDriveCleanup}
//                         className="w-full text-left px-4 py-2 text-sm text-gray-300 hover:bg-[#283c5d] hover:text-white flex items-center"
//                     >
//                         <svg className="w-4 h-4 mr-2" viewBox="0 0 24 24" fill="none" stroke="currentColor">
//                             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
//                         </svg>
//                         Drive Cleanup
//                     </button>
//                 </div>
//             </div>
//         );
//     };

//     const getTitle = () => {
//         switch (currentView) {
//             case 'my-drive':
//                 return 'My Drive';
//             case 'recycle-bin':
//                 return 'Recycle Bin';
//             case 'drive-cleanup':
//                 return 'Drive Cleanup';
//             default:
//                 return 'Drive';
//         }
//     };

//     const renderTopBar = () => {
//         return (
//             <div className="flex justify-between items-center mb-5">
//                 <div className="flex items-center">
//                     <h2 className="text-2xl font-semibold text-gray-700 dark:text-gray-300">
//                         {getTitle()}
//                     </h2>
//                 </div>
//                 <div className="flex items-center space-x-2">
//                     {currentView === 'my-drive' && (
//                         <>
//                             <button 
//                                 type="button" 
//                                 className="btn btn-outline-primary"
//                                 onClick={() => handleViewChange('recycle-bin')}
//                             >
//                                 RECYCLE BIN
//                             </button>
//                             <div className="relative">
//                                 <button
//                                     onClick={() => setIsSettingsDropdownOpen(!isSettingsDropdownOpen)}
//                                     className="p-2 text-gray-400 hover:bg-[#283c5d] rounded-full"
//                                 >
//                                     <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor">
//                                         <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
//                                         <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
//                                     </svg>
//                                 </button>
//                                 {renderSettingsDropdown()}
//                             </div>
//                             <div className="relative">
//                                 <button
//                                     onClick={() => setIsAddDropdownOpen(!isAddDropdownOpen)}
//                                     className="px-4 py-2 bg-[#4361ee] text-white rounded-md hover:bg-[#3651d4] flex items-center"
//                                 >
//                                     <svg className="w-5 h-5 mr-1" viewBox="0 0 24 24" fill="none" stroke="currentColor">
//                                         <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
//                                     </svg>
//                                     ADD
//                                 </button>
//                                 {renderDropdown()}
//                             </div>
//                         </>
//                     )}
//                 </div>
//             </div>
//         );
//     };

//     return (
//         <div>
//             {notification && (
//                 <div className={`fixed top-4 right-4 p-4 rounded-md shadow-lg ${
//                     notification.type === 'success' ? 'bg-green-500' : 'bg-red-500'
//                 } text-white z-50`}>
//                     {notification.message}
//                 </div>
//             )}
//             <input 
//                 type="file" 
//                 ref={fileInputRef}
//                 className="hidden"
//                 onChange={handleFileChange}
//             />
//             {/* Navigation */}
//             <div className="mb-5 flex items-center justify-between border-b border-[#ebedf2] dark:border-[#191e3a]">
//                 <div className="flex items-center gap-4">
//                     <button
//                         onClick={() => handleViewChange('my-drive')}
//                         className={`!py-4 !px-2 -mb-[1px] ${
//                             currentView === 'my-drive'
//                                 ? 'text-primary border-b border-primary'
//                                 : 'text-gray-500 dark:text-gray-400 hover:text-primary'
//                         }`}
//                     >
//                         My Drive
//                     </button>
//                     <button
//                         onClick={() => handleViewChange('drive-cleanup')}
//                         className={`!py-4 !px-2 -mb-[1px] ${
//                             currentView === 'drive-cleanup'
//                                 ? 'text-primary border-b border-primary'
//                                 : 'text-gray-500 dark:text-gray-400 hover:text-primary'
//                         }`}
//                     >
//                         Drive Cleanup
//                     </button>
//                     <div className="relative">
//                         <button
//                             onClick={() => {
//                                 setIsMoreDropdownOpen(!isMoreDropdownOpen);
//                                 if (!isMoreDropdownOpen) {
//                                     setIsConfigureMode(false);
//                                 }
//                             }}
//                             className={`!py-4 !px-2 -mb-[1px] ${
//                                 currentView === 'more'
//                                     ? 'text-primary border-b border-primary'
//                                     : 'text-gray-300 hover:text-blue-500'
//                             }`}
//                         >
//                             More
//                             <svg className="w-4 h-4 ml-1 inline-block" viewBox="0 0 24 24" fill="none">
//                                 <path d="M19 9L12 16L5 9" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
//                             </svg>
//                         </button>
//                         {renderMoreDropdown()}
//                     </div>
//                 </div>
//             </div>

//             {/* Main Content */}
//             <div className="panel">
//                 {/* Header */}
//                 {renderTopBar()}
//                 {/* Content based on current view */}
//                 <div className="mt-5">
//                     {currentView === 'cleanup' ? (
//                         <div className="flex flex-col items-center justify-center h-full p-8">
//                             <div className="mb-8">
//                                 <div className="w-48 h-48 bg-blue-100 rounded-full flex items-center justify-center">
//                                     <svg width="100" height="100" viewBox="0 0 24 24" fill="none" className="text-blue-500">
//                                         <path d="M6.25 22C4.18 22 2.5 20.32 2.5 18.25V5.75C2.5 3.68 4.18 2 6.25 2H17.75C19.82 2 21.5 3.68 21.5 5.75V18.25C21.5 20.32 19.82 22 17.75 22H6.25Z" stroke="currentColor" strokeWidth="1.5"/>
//                                     </svg>
//                                 </div>
//                             </div>
//                             <h2 className="text-2xl font-semibold mb-4">Drive Cleanup</h2>
//                             <p className="text-gray-500 text-center max-w-md">
//                                 There are no files that need cleanup at the moment. We'll notify you when there are files that can be safely removed.
//                             </p>
//                         </div>
//                     ) : (
//                         <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
//                             {folders
//                                 .filter(folder => folder.name.toLowerCase().includes(searchTerm.toLowerCase()))
//                                 .map((folder) => (
//                                     <div key={folder.id} className="border border-[#e0e6ed] dark:border-[#191e3a] rounded-md p-4 hover:shadow-[0_0_15px_1px_rgba(113,106,202,0.20)]">
//                                         <div className="flex items-start justify-between">
//                                             <div className="w-14 h-14 bg-primary/20 rounded-md flex items-center justify-center">
//                                                 <svg width="24" height="24" viewBox="0 0 24 24" fill="none" className="text-primary">
//                                                     <path opacity="0.5" d="M18 10L13 10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"></path>
//                                                     <path d="M2 6.94975C2 6.06722 2 5.62595 2.06935 5.25839C2.37464 3.64031 3.64031 2.37464 5.25839 2.06935C5.62595 2 6.06722 2 6.94975 2C7.33642 2 7.52976 2 7.71557 2.01738C8.51665 2.09229 9.27652 2.40704 9.89594 2.92051C10.0396 3.03961 10.1763 3.17633 10.4497 3.44975L11 4C11.8158 4.81578 12.2237 5.22367 12.7121 5.49543C12.9804 5.64471 13.2651 5.7626 13.5604 5.84678C14.0979 6 14.6747 6 15.8284 6H16.2021C18.8345 6 20.1506 6 21.0062 6.76946C21.0849 6.84024 21.1598 6.91514 21.2305 6.99383C22 7.84935 22 9.16554 22 11.7979V14C22 17.7712 22 19.6569 20.8284 20.8284C19.6569 22 17.7712 22 14 22H10C6.22876 22 4.34315 22 3.17157 20.8284C2 19.6569 2 17.7712 2 14V6.94975Z" stroke="currentColor" strokeWidth="1.5"></path>
//                                                 </svg>
//                                             </div>
//                                         </div>
//                                         <div className="mt-4">
//                                             <h6 className="text-base font-medium">{folder.name}</h6>
//                                             <p className="text-xs text-gray-500 mt-1">
//                                                 Modified: {new Date(folder.dateChanged).toLocaleDateString()}
//                                             </p>
//                                         </div>
//                                     </div>
//                                 ))}
//                         </div>
//                     )}
//                 </div>
//             </div>

//             {/* Modals */}
//             {renderDocumentModal()}
//             {renderFolderModal()}
//             {renderResetConfirm()}
//             {renderRecycleBin()}
//             {renderDriveCleanup()}
//         </div>
//     );
// };

// export default Drive;



// Updated DRIVE
import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';

type ServiceType = 'Google Docs' | 'MS Office Online' | 'Office 365' | 'Desktop applications';

interface Folder {
    id: number;
    name: string;
    type: string;
    userId: number;
    itemType: string;
    category?: string;
    createdAt: string;
    dateChanged: string;
    size: string;
    shared?: boolean;
}

interface RecycleBinItem {
    id: number;
    name: string;
    dateDeleted: string;
    size: string;
    originalPath: string;
}

const Drive = () => {
    const [selectedItems, setSelectedItems] = useState<number>(0);
    const [isAddDropdownOpen, setIsAddDropdownOpen] = useState(false);
    const [activeSubmenu, setActiveSubmenu] = useState<ServiceType | null>(null);
    const [selectedService, setSelectedService] = useState<ServiceType | null>(null);
    const [selectedDocType, setSelectedDocType] = useState('');
    const [isSettingsDropdownOpen, setIsSettingsDropdownOpen] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [currentView, setCurrentView] = useState<'my-drive' | 'drive-cleanup' | 'more' | 'recycle-bin'>('my-drive');
    const [searchTerm, setSearchTerm] = useState('');
    const [sortOption, setSortOption] = useState('Last Modified');
    const [isSortDropdownOpen, setIsSortDropdownOpen] = useState(false);
    const [isMoreDropdownOpen, setIsMoreDropdownOpen] = useState(false);
    const [folders, setFolders] = useState<Folder[]>([]);
    const [notification, setNotification] = useState<{ type: 'success' | 'error', message: string } | null>(null);
    const [recycleBinItems, setRecycleBinItems] = useState<RecycleBinItem[]>([]);
    const [sortBy, setSortBy] = useState<'date_deleted' | 'date_changed' | 'id' | 'name' | 'size' | 'reverse' | 'mixed'>('date_deleted');

    // Document creation states
    const [showDocCreationModal, setShowDocCreationModal] = useState(false);
    const [docName, setDocName] = useState('');
    const [docContent, setDocContent] = useState('');
    
    // Spreadsheet creation states
    const [showSheetCreationModal, setShowSheetCreationModal] = useState(false);
    const [sheetName, setSheetName] = useState('');
    const [sheetHeaders, setSheetHeaders] = useState('');
    
    // Presentation creation states
    const [showPresentationCreationModal, setShowPresentationCreationModal] = useState(false);
    const [presentationName, setPresentationName] = useState('');
    const [presentationTheme, setPresentationTheme] = useState('');
    const [slideCount, setSlideCount] = useState(1);

    const dropdownRef = useRef<HTMLDivElement>(null);
    const [showResetConfirm, setShowResetConfirm] = useState(false);
    const [isConfigureMode, setIsConfigureMode] = useState(false);
    const [showFolderModal, setShowFolderModal] = useState(false);
    const [newFolderName, setNewFolderName] = useState('');
    const [totalUsed, setTotalUsed] = useState('0.65 Kb');
    const [totalFiles, setTotalFiles] = useState(1);
    const [isScanning, setIsScanning] = useState(false);
    const [cleanupSize, setCleanupSize] = useState('0 b');
    const [showRecycleBinSettings, setShowRecycleBinSettings] = useState(false);
    const [showSettingsModal, setShowSettingsModal] = useState(false);

    const showNotification = (type: 'success' | 'error', message: string) => {
        setNotification({ type, message });
        setTimeout(() => setNotification(null), 3000);
    };

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsAddDropdownOpen(false);
                setActiveSubmenu(null);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files.length > 0) {
            const file = e.target.files[0];
            setSelectedFile(file);
            showNotification('success', `Selected file: ${file.name}`);
            
            // Here you would typically upload the file to your server
            // Example:
            // const formData = new FormData();
            // formData.append('file', file);
            // axios.post('/api/upload', formData)
            //   .then(response => {
            //     showNotification('success', 'File uploaded successfully');
            //   })
            //   .catch(error => {
            //     showNotification('error', 'File upload failed');
            //   });
        }
    };

    const handleAddItem = (itemType: string, service?: ServiceType) => {
        if (service) {
            setSelectedService(service);
            setSelectedDocType(itemType);
            
            if (itemType === 'Document') {
                setShowDocCreationModal(true);
            } else if (itemType === 'Spreadsheet') {
                setShowSheetCreationModal(true);
            } else if (itemType === 'Presentation') {
                setShowPresentationCreationModal(true);
            }
        } else {
            if (itemType === 'File') {
                fileInputRef.current?.click();
            } else if (itemType === 'Folder') {
                setShowFolderModal(true);
            }
        }
        setIsAddDropdownOpen(false);
    };

    const createDocument = async () => {
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                showNotification('error', 'Please login to create documents');
                return;
            }

            const fileName = docName || `New Document ${new Date().toLocaleDateString()}`;
            
            const response = await axios.post('http://localhost:5000/api/folders', {
                name: fileName,
                type: currentView,
                itemType: 'file',
                category: 'document',
                content: docContent,
                service: selectedService
            }, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (response.data) {
                const foldersResponse = await axios.get('http://localhost:5000/api/folders', {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });
                setFolders(foldersResponse.data);
                showNotification('success', `Document created successfully with ${selectedService}`);
                setShowDocCreationModal(false);
                setDocName('');
                setDocContent('');
            }
        } catch (error) {
            console.error('Error creating document:', error);
            showNotification('error', 'Failed to create document');
        }
    };

    const createSpreadsheet = async () => {
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                showNotification('error', 'Please login to create spreadsheets');
                return;
            }

            const fileName = sheetName || `New Spreadsheet ${new Date().toLocaleDateString()}`;
            
            const response = await axios.post('http://localhost:5000/api/folders', {
                name: fileName,
                type: currentView,
                itemType: 'file',
                category: 'spreadsheet',
                headers: sheetHeaders.split(',').map(h => h.trim()),
                service: selectedService
            }, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (response.data) {
                const foldersResponse = await axios.get('http://localhost:5000/api/folders', {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });
                setFolders(foldersResponse.data);
                showNotification('success', `Spreadsheet created successfully with ${selectedService}`);
                setShowSheetCreationModal(false);
                setSheetName('');
                setSheetHeaders('');
            }
        } catch (error) {
            console.error('Error creating spreadsheet:', error);
            showNotification('error', 'Failed to create spreadsheet');
        }
    };

    const createPresentation = async () => {
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                showNotification('error', 'Please login to create presentations');
                return;
            }

            const fileName = presentationName || `New Presentation ${new Date().toLocaleDateString()}`;
            
            const response = await axios.post('http://localhost:5000/api/folders', {
                name: fileName,
                type: currentView,
                itemType: 'file',
                category: 'presentation',
                theme: presentationTheme,
                slides: slideCount,
                service: selectedService
            }, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (response.data) {
                const foldersResponse = await axios.get('http://localhost:5000/api/folders', {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });
                setFolders(foldersResponse.data);
                showNotification('success', `Presentation created successfully with ${selectedService}`);
                setShowPresentationCreationModal(false);
                setPresentationName('');
                setPresentationTheme('');
                setSlideCount(1);
            }
        } catch (error) {
            console.error('Error creating presentation:', error);
            showNotification('error', 'Failed to create presentation');
        }
    };

    const handleCreateFolder = async () => {
        if (!newFolderName.trim()) {
            showNotification('error', 'Please enter a folder name');
            return;
        }

        try {
            const token = localStorage.getItem('token');
            if (!token) {
                showNotification('error', 'Please login to create folders');
                return;
            }

            const response = await axios.post('http://localhost:5000/api/folders', {
                name: newFolderName,
                type: currentView,
                itemType: 'folder'
            }, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (response.data) {
                const foldersResponse = await axios.get('http://localhost:5000/api/folders', {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });
                setFolders(foldersResponse.data);
                showNotification('success', 'Folder created successfully');
            }
        } catch (error) {
            console.error('Error creating folder:', error);
            showNotification('error', 'Failed to create folder');
        }

        setShowFolderModal(false);
        setNewFolderName('');
    };

    const handleDelete = async (itemId: number) => {
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                showNotification('error', 'Please login to delete items');
                return;
            }

            // Move the item to recycle bin
            const itemToDelete = folders.find(f => f.id === itemId);
            if (itemToDelete) {
                const recycleBinItem: RecycleBinItem = {
                    id: itemToDelete.id,
                    name: itemToDelete.name,
                    dateDeleted: new Date().toISOString(),
                    size: '1 MB',
                    originalPath: itemToDelete.type
                };
                setRecycleBinItems(prev => [...prev, recycleBinItem]);
            }

            // Remove from current view
            setFolders(folders.filter(f => f.id !== itemId));
            showNotification('success', 'Item moved to recycle bin');
        } catch (error) {
            console.error('Error deleting item:', error);
            showNotification('error', 'Failed to delete item');
        }
    };

    const menuItems = [
        { type: 'File', hasSubmenu: false },
        { type: 'Folder', hasSubmenu: false },
        { 
            type: 'Google Docs' as ServiceType,
            hasSubmenu: true,
            submenu: ['Document', 'Spreadsheet', 'Presentation']
        },
        { 
            type: 'MS Office Online' as ServiceType,
            hasSubmenu: true,
            submenu: ['Document', 'Spreadsheet', 'Presentation']
        },
        { 
            type: 'Office 365' as ServiceType,
            hasSubmenu: true,
            submenu: ['Document', 'Spreadsheet', 'Presentation']
        },
        { 
            type: 'Desktop applications' as ServiceType,
            hasSubmenu: true,
            submenu: ['Document', 'Spreadsheet', 'Presentation']
        }
    ];

    const renderDropdown = () => {
        if (!isAddDropdownOpen) return null;

        return (
            <div className="absolute top-full left-0 mt-1 w-48 bg-[#1b2e4b] rounded-md shadow-lg">
                {menuItems.map((item, index) => (
                    <div key={index} className="relative group">
                        <button
                            className="flex items-center justify-between w-full px-4 py-2 text-sm text-gray-300 hover:bg-[#283c5d]"
                            onClick={() => !item.hasSubmenu && handleAddItem(item.type)}
                            onMouseEnter={() => item.hasSubmenu && setActiveSubmenu(item.type as ServiceType)}
                            onMouseLeave={() => setActiveSubmenu(null)}
                        >
                            {item.type}
                            {item.hasSubmenu && (
                                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none">
                                    <path d="M9 5L16 12L9 19" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                                </svg>
                            )}
                        </button>
                        {item.hasSubmenu && activeSubmenu === item.type && (
                            <div 
                                className="absolute right-full top-0 w-48 bg-[#1b2e4b] rounded-md shadow-lg"
                                style={{ marginRight: '2px' }}
                                onMouseEnter={() => setActiveSubmenu(item.type as ServiceType)}
                                onMouseLeave={() => setActiveSubmenu(null)}
                            >
                                {item.submenu?.map((subItem, subIndex) => (
                                    <button
                                        key={subIndex}
                                        className="block w-full text-left px-4 py-2 text-sm text-gray-300 hover:bg-[#283c5d]"
                                        onClick={() => handleAddItem(subItem, item.type as ServiceType)}
                                    >
                                        {subItem}
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>
                ))}
            </div>
        );
    };

    const renderDocumentCreationModal = () => {
        if (!showDocCreationModal) return null;

        return (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                <div className="bg-white rounded-lg w-96">
                    <div className="p-4 border-b">
                        <h2 className="text-lg font-medium">Create New Document</h2>
                    </div>
                    <div className="p-6">
                        <div className="mb-4">
                            <label className="block text-sm font-medium text-gray-700 mb-1">Document Name</label>
                            <input
                                type="text"
                                value={docName}
                                onChange={(e) => setDocName(e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                                placeholder="Enter document name"
                            />
                        </div>
                        <div className="mb-4">
                            <label className="block text-sm font-medium text-gray-700 mb-1">Content</label>
                            <textarea
                                value={docContent}
                                onChange={(e) => setDocContent(e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                                rows={5}
                                placeholder="Enter document content"
                            />
                        </div>
                    </div>
                    <div className="flex justify-end gap-2 p-4 border-t">
                        <button
                            onClick={() => setShowDocCreationModal(false)}
                            className="px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-md"
                        >
                            Cancel
                        </button>
                        <button
                            onClick={createDocument}
                            className="px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-md"
                        >
                            Create Document
                        </button>
                    </div>
                </div>
            </div>
        );
    };

    const renderSpreadsheetCreationModal = () => {
        if (!showSheetCreationModal) return null;

        return (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                <div className="bg-white rounded-lg w-96">
                    <div className="p-4 border-b">
                        <h2 className="text-lg font-medium">Create New Spreadsheet</h2>
                    </div>
                    <div className="p-6">
                        <div className="mb-4">
                            <label className="block text-sm font-medium text-gray-700 mb-1">Spreadsheet Name</label>
                            <input
                                type="text"
                                value={sheetName}
                                onChange={(e) => setSheetName(e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                                placeholder="Enter spreadsheet name"
                            />
                        </div>
                        <div className="mb-4">
                            <label className="block text-sm font-medium text-gray-700 mb-1">Column Headers (comma separated)</label>
                            <input
                                type="text"
                                value={sheetHeaders}
                                onChange={(e) => setSheetHeaders(e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                                placeholder="e.g. Name, Age, Email"
                            />
                        </div>
                    </div>
                    <div className="flex justify-end gap-2 p-4 border-t">
                        <button
                            onClick={() => setShowSheetCreationModal(false)}
                            className="px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-md"
                        >
                            Cancel
                        </button>
                        <button
                            onClick={createSpreadsheet}
                            className="px-4 py-2 text-sm font-medium text-white bg-green-600 hover:bg-green-700 rounded-md"
                        >
                            Create Spreadsheet
                        </button>
                    </div>
                </div>
            </div>
        );
    };

    const renderPresentationCreationModal = () => {
        if (!showPresentationCreationModal) return null;

        return (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                <div className="bg-white rounded-lg w-96">
                    <div className="p-4 border-b">
                        <h2 className="text-lg font-medium">Create New Presentation</h2>
                    </div>
                    <div className="p-6">
                        <div className="mb-4">
                            <label className="block text-sm font-medium text-gray-700 mb-1">Presentation Name</label>
                            <input
                                type="text"
                                value={presentationName}
                                onChange={(e) => setPresentationName(e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                                placeholder="Enter presentation name"
                            />
                        </div>
                        <div className="mb-4">
                            <label className="block text-sm font-medium text-gray-700 mb-1">Theme</label>
                            <input
                                type="text"
                                value={presentationTheme}
                                onChange={(e) => setPresentationTheme(e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                                placeholder="Enter presentation theme"
                            />
                        </div>
                        <div className="mb-4">
                            <label className="block text-sm font-medium text-gray-700 mb-1">Number of Slides</label>
                            <input
                                type="number"
                                value={slideCount}
                                onChange={(e) => setSlideCount(parseInt(e.target.value) || 1)}
                                min="1"
                                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                            />
                        </div>
                    </div>
                    <div className="flex justify-end gap-2 p-4 border-t">
                        <button
                            onClick={() => setShowPresentationCreationModal(false)}
                            className="px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-md"
                        >
                            Cancel
                        </button>
                        <button
                            onClick={createPresentation}
                            className="px-4 py-2 text-sm font-medium text-white bg-yellow-500 hover:bg-yellow-600 rounded-md"
                        >
                            Create Presentation
                        </button>
                    </div>
                </div>
            </div>
        );
    };

    const renderFolderModal = () => {
        if (!showFolderModal) return null;

        return (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                <div className="bg-[#1b2e4b] rounded-lg shadow-xl w-96 p-6">
                    <div className="flex justify-between items-center mb-4">
                        <h3 className="text-xl font-semibold text-gray-300">Create folder</h3>
                        <button
                            onClick={() => setShowFolderModal(false)}
                            className="text-gray-400 hover:text-gray-300"
                        >
                            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    </div>
                    <div className="mb-4">
                        <label className="block text-gray-400 text-sm font-medium mb-2">Name</label>
                        <input
                            type="text"
                            value={newFolderName}
                            onChange={(e) => setNewFolderName(e.target.value)}
                            className="w-full px-3 py-2 bg-[#283c5d] border border-gray-600 rounded-md text-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            placeholder="Enter folder name"
                        />
                    </div>
                    <div className="flex justify-end space-x-3">
                        <button
                            onClick={() => setShowFolderModal(false)}
                            className="px-4 py-2 text-sm font-medium text-gray-300 hover:text-white bg-gray-700 hover:bg-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-500"
                        >
                            Cancel
                        </button>
                        <button
                            onClick={handleCreateFolder}
                            className="px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                            Create
                        </button>
                    </div>
                </div>
            </div>
        );
    };

    const renderTopBar = () => {
        return (
            <div className="flex justify-between items-center mb-5">
                <div className="flex items-center">
                    <h2 className="text-2xl font-semibold text-gray-700 dark:text-gray-300">
                        {currentView === 'my-drive' ? 'My Drive' : 
                         currentView === 'recycle-bin' ? 'Recycle Bin' : 
                         currentView === 'drive-cleanup' ? 'Drive Cleanup' : 'Drive'}
                    </h2>
                </div>
                <div className="flex items-center space-x-2">
                    {currentView === 'my-drive' && (
                        <>
                            <button 
                                type="button" 
                                className="btn btn-outline-primary"
                                onClick={() => handleViewChange('recycle-bin')}
                            >
                                RECYCLE BIN
                            </button>
                            <div className="relative">
                                <button
                                    onClick={() => setIsSettingsDropdownOpen(!isSettingsDropdownOpen)}
                                    className="p-2 text-gray-400 hover:bg-[#283c5d] rounded-full"
                                >
                                    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                    </svg>
                                </button>
                            </div>
                            <div className="relative" ref={dropdownRef}>
                                <button
                                    onClick={() => setIsAddDropdownOpen(!isAddDropdownOpen)}
                                    className="px-4 py-2 bg-[#4361ee] text-white rounded-md hover:bg-[#3651d4] flex items-center"
                                >
                                    <svg className="w-5 h-5 mr-1" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
                                    </svg>
                                    ADD
                                </button>
                                {renderDropdown()}
                            </div>
                        </>
                    )}
                </div>
            </div>
        );
    };

    return (
        <div>
            {notification && (
                <div className={`fixed top-4 right-4 p-4 rounded-md shadow-lg ${
                    notification.type === 'success' ? 'bg-green-500' : 'bg-red-500'
                } text-white z-50`}>
                    {notification.message}
                </div>
            )}
            <input 
                type="file" 
                ref={fileInputRef}
                className="hidden"
                onChange={handleFileChange}
            />
            
            {/* Navigation */}
            <div className="mb-5 flex items-center justify-between border-b border-[#ebedf2] dark:border-[#191e3a]">
                <div className="flex items-center gap-4">
                    <button
                        onClick={() => handleViewChange('my-drive')}
                        className={`!py-4 !px-2 -mb-[1px] ${
                            currentView === 'my-drive'
                                ? 'text-primary border-b border-primary'
                                : 'text-gray-500 dark:text-gray-400 hover:text-primary'
                        }`}
                    >
                        My Drive
                    </button>
                    <button
                        onClick={() => handleViewChange('drive-cleanup')}
                        className={`!py-4 !px-2 -mb-[1px] ${
                            currentView === 'drive-cleanup'
                                ? 'text-primary border-b border-primary'
                                : 'text-gray-500 dark:text-gray-400 hover:text-primary'
                        }`}
                    >
                        Drive Cleanup
                    </button>
                    <div className="relative">
                        <button
                            onClick={() => {
                                setIsMoreDropdownOpen(!isMoreDropdownOpen);
                                if (!isMoreDropdownOpen) {
                                    setIsConfigureMode(false);
                                }
                            }}
                            className={`!py-4 !px-2 -mb-[1px] ${
                                currentView === 'more'
                                    ? 'text-primary border-b border-primary'
                                    : 'text-gray-300 hover:text-blue-500'
                            }`}
                        >
                            More
                            <svg className="w-4 h-4 ml-1 inline-block" viewBox="0 0 24 24" fill="none">
                                <path d="M19 9L12 16L5 9" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                            </svg>
                        </button>
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="panel">
                {/* Header */}
                {renderTopBar()}
                {/* Content based on current view */}
                <div className="mt-5">
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                        {folders
                            .filter(folder => folder.name.toLowerCase().includes(searchTerm.toLowerCase()))
                            .map((folder) => (
                                <div key={folder.id} className="border border-[#e0e6ed] dark:border-[#191e3a] rounded-md p-4 hover:shadow-[0_0_15px_1px_rgba(113,106,202,0.20)]">
                                    <div className="flex items-start justify-between">
                                        <div className="w-14 h-14 bg-primary/20 rounded-md flex items-center justify-center">
                                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" className="text-primary">
                                                <path opacity="0.5" d="M18 10L13 10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"></path>
                                                <path d="M2 6.94975C2 6.06722 2 5.62595 2.06935 5.25839C2.37464 3.64031 3.64031 2.37464 5.25839 2.06935C5.62595 2 6.06722 2 6.94975 2C7.33642 2 7.52976 2 7.71557 2.01738C8.51665 2.09229 9.27652 2.40704 9.89594 2.92051C10.0396 3.03961 10.1763 3.17633 10.4497 3.44975L11 4C11.8158 4.81578 12.2237 5.22367 12.7121 5.49543C12.9804 5.64471 13.2651 5.7626 13.5604 5.84678C14.0979 6 14.6747 6 15.8284 6H16.2021C18.8345 6 20.1506 6 21.0062 6.76946C21.0849 6.84024 21.1598 6.91514 21.2305 6.99383C22 7.84935 22 9.16554 22 11.7979V14C22 17.7712 22 19.6569 20.8284 20.8284C19.6569 22 17.7712 22 14 22H10C6.22876 22 4.34315 22 3.17157 20.8284C2 19.6569 2 17.7712 2 14V6.94975Z" stroke="currentColor" strokeWidth="1.5"></path>
                                            </svg>
                                        </div>
                                        <button 
                                            onClick={() => handleDelete(folder.id)}
                                            className="text-gray-400 hover:text-red-500"
                                        >
                                            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                            </svg>
                                        </button>
                                    </div>
                                    <div className="mt-4">
                                        <h6 className="text-base font-medium">{folder.name}</h6>
                                        <p className="text-xs text-gray-500 mt-1">
                                            Modified: {new Date(folder.dateChanged).toLocaleDateString()}
                                        </p>
                                    </div>
                                </div>
                            ))}
                    </div>
                </div>
            </div>

            {/* Modals */}
            {renderDocumentCreationModal()}
            {renderSpreadsheetCreationModal()}
            {renderPresentationCreationModal()}
            {renderFolderModal()}
        </div>
    );
};

export default Drive;