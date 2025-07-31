'use client';
import React, { useState, useEffect } from 'react';
// --- Import ALL potential icons used in your database ---
import {
  CalendarDaysIcon,
  CalendarIcon,
  Tag,
  FileText,
  Paperclip,
  Upload,
  X,
  Send,
  Clock3Icon,
  AlertCircle,
  Home,
  Baby,
  User,
  Stethoscope,
  GraduationCap,
  Plane,
} from 'lucide-react';
import {
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import supabase from '@/lib/helper';
import { useUser } from '@/components/providers/UserContext';
import { useAlert } from '@/components/providers/AlertProvider';

// --- Icon Mapping ---
// Maps the string names from your database to the actual Lucide React components
const iconMap = {
  Home: Home,
  AlertCircle: AlertCircle,
  Baby: Baby,
  User: User,
  Stethoscope: Stethoscope,
  GraduationCap: GraduationCap,
  Plane: Plane,
  Calendar: CalendarIcon, 
  Tag: Tag,           
  FileText: FileText,   
};

const NewRequestModalContent = ({ onClose, onSubmissionSuccess, availableLeaveTypes = [], pendingStatusId }) => {
  const [modalStartDate, setModalStartDate] = useState('');
  const [modalEndDate, setModalEndDate] = useState('');
  const [modalLeaveType, setModalLeaveType] = useState('');
  const [modalReason, setModalReason] = useState('');
  const [attachments, setAttachments] = useState([]);
  const [isModalSubmitting, setIsModalSubmitting] = useState(false);
  const [uploadError, setUploadError] = useState(null);
  const { userId } = useUser();
  const { showAlert } = useAlert();


  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    setAttachments(prevFiles => [...prevFiles, ...files]);
  };

  const removeAttachment = (fileToRemove) => {
    setAttachments(prevFiles => prevFiles.filter(file => file !== fileToRemove));
  };

  const calculateModalDays = () => {
    if (!modalStartDate || !modalEndDate) return 0;
    const start = new Date(modalStartDate);
    const end = new Date(modalEndDate);
    if (end < start) return 0;
    const diffTime = Math.abs(end.getTime() - start.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays + 1;
  };

  // Upload attachments to Supabase Storage
  const uploadAttachments = async (requestId) => {
    const uploadedPaths = [];
    for (const file of attachments) {
      const fileName = `${Date.now()}-${file.name}`;
      const filePath = `${requestId}/${fileName}`;
      const { data, error } = await supabase.storage
        .from('leave-attachments')
        .upload(filePath, file);

      if (error) {
        console.error('Error uploading file:', file.name, error);
        setUploadError(`Failed to upload ${file.name}. Please try again.`);
      } else {
        console.log('File uploaded successfully:', data.path);
        uploadedPaths.push(data.path);
      }
    }
    return uploadedPaths; 
  };

  // Save attachment metadata to the database
  const saveAttachmentMetadata = async (requestId, filePaths) => {
    if (filePaths.length === 0) return;

    const attachmentData = filePaths.map(filePath => {
      // Find the original file object to get size and type
      const originalFile = attachments.find(f => `${Date.now()}-${f.name}`.includes(filePath.split('/').pop()));
      return {
        leave_request_id: requestId,
        file_name: filePath.split('/').pop(),
        file_path: filePath,
        file_size: originalFile?.size || 0,
        mime_type: originalFile?.type || '',
      };
    });

    const { error } = await supabase
      .from('leave_request_attachments')
      .insert(attachmentData);

    if (error) {
      console.error('Error saving attachment metadata:', error);
      showAlert('Failed to save attachment information.', 'error');
    } else {
      console.log('Attachment metadata saved successfully.');
    }
  };

  const handleModalSubmit = async (e) => {
    e.preventDefault();

    // Basic validation - ensure props are passed correctly
    if (!availableLeaveTypes || availableLeaveTypes.length === 0) {
      showAlert('Leave types are not loaded. Please try again.', 'error');
      return;
    }
    if (!pendingStatusId) {
      showAlert('Pending status ID is not available. Please try again.', 'error');
      return;
    }

    if (!modalStartDate || !modalEndDate || !modalLeaveType || !modalReason) {
      showAlert('Please fill in all required fields.', 'info');
      return;
    }

    // Basic date validation
    const startDateObj = new Date(modalStartDate);
    const endDateObj = new Date(modalEndDate);
    if (endDateObj < startDateObj) {
        showAlert('End date cannot be before start date.', 'info');
        return;
    }

    setIsModalSubmitting(true);
    setUploadError(null);

    try {
      // Ensure user is authenticated and get user ID
      if (!userId) {
         throw new Error('User not authenticated');
      }

      // Find the selected leave type object to get its ID
      const selectedType = availableLeaveTypes.find(type => type.name === modalLeaveType);
      if (!selectedType) {
         throw new Error(`Selected leave type '${modalLeaveType}' not found.`);
      }
      const leaveTypeId = selectedType.id;

      // Calculate total days
      const calculatedDays = calculateModalDays();

      // Prepare the new leave request data
      const newRequest = {
        user_id: userId,
        leave_type_id: leaveTypeId,
        status_id: pendingStatusId, // Use the prop
        start_date: modalStartDate,
        end_date: modalEndDate,
        total_days: calculatedDays,
        reason: modalReason,
        // submitted_at and last_updated will default via DB
      };

      // Insert the new leave request into the database
      const { data: requestData, error: insertError } = await supabase
        .from('leave_requests')
        .insert([newRequest])
        .select()
        .single();

      if (insertError) throw insertError;

      console.log('Leave request submitted:', requestData);
      showAlert('Leave request submitted successfully!', 'success');

      // Handle Attachments (if any)
      if (attachments.length > 0 && requestData?.id) {
        const uploadedPaths = await uploadAttachments(requestData.id);
        if (uploadedPaths.length > 0) {
          await saveAttachmentMetadata(requestData.id, uploadedPaths);
        }
        // Note: If some uploads failed, `uploadedPaths.length` will be less than `attachments.length`.
        // You might want to inform the user about partial failures.
        if (uploadedPaths.length < attachments.length) {
             // Some uploads failed, but the request was submitted.
             console.warn('Some attachments failed to upload.');
        }
      }

      // Reset form fields
      setModalStartDate('');
      setModalEndDate('');
      setModalLeaveType('');
      setModalReason('');
      setAttachments([]);

      // Notify parent component of successful submission
      if (onSubmissionSuccess) {
        onSubmissionSuccess(requestData); // Pass the new request data back
      }

      // Close the modal (if onClose is handled by parent/DialogTrigger, this might be optional)
      if (onClose) {
        onClose();
      }

    } catch (error) {
      console.error('Error submitting leave request:', error);
      showAlert(`Error submitting request: ${error.message || 'Unknown error'}`, 'error');
    } finally {
      setIsModalSubmitting(false);
    }
  };


  return (
    <>
      <DialogHeader>
        {/* Simplified DialogTitle to avoid Radix warnings */}
        <DialogTitle className="flex items-center gap-2 text-xl font-semibold leading-none tracking-tight">
          <CalendarDaysIcon className="w-5 h-5 text-blue-700 flex-shrink-0" />
          <span>New Leave Request</span>
        </DialogTitle>
        <DialogDescription>
          Please fill in the details for your leave request.
        </DialogDescription>
      </DialogHeader>

      <form onSubmit={handleModalSubmit} className="space-y-5 py-2">
        {/* Date Inputs */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="modalStartDate" className="text-sm font-medium flex items-center">
              <CalendarIcon className="w-4 h-4 mr-2 text-gray-500" />
              Start Date *
            </Label>
            <Input
              id="modalStartDate"
              type="date"
              value={modalStartDate}
              onChange={(e) => setModalStartDate(e.target.value)}
              className="w-full border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="modalEndDate" className="text-sm font-medium flex items-center">
              <CalendarIcon className="w-4 h-4 mr-2 text-gray-500" />
              End Date *
            </Label>
            <Input
              id="modalEndDate"
              type="date"
              value={modalEndDate}
              onChange={(e) => setModalEndDate(e.target.value)}
              className="w-full border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
              required
              min={modalStartDate || undefined} // Prevent selecting a start date after the end date
            />
          </div>
        </div>

        {/* Leave Type and Duration */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="modalLeaveType" className="text-sm font-medium flex items-center">
              <Tag className="w-4 h-4 mr-2 text-gray-500" />
              Leave Type *
            </Label>
            <Select value={modalLeaveType} onValueChange={setModalLeaveType} required>
              <SelectTrigger className="w-full border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm">
                <SelectValue placeholder="Select type" />
              </SelectTrigger>
              <SelectContent>
                {availableLeaveTypes && availableLeaveTypes.length > 0 ? (
                  availableLeaveTypes.map((type) => {
                    // Dynamically get the icon component
                    const IconComponent = iconMap[type.icon] || FileText; // Default to FileText if not found
                    return (
                      <SelectItem key={type.id} value={type.name}>
                        <div className={`flex items-center px-2 py-1 rounded ${type.color_class || 'bg-gray-100 text-gray-800'}`}>
                          {/* Render the actual icon component */}
                          <IconComponent className="mr-2 h-4 w-4" />
                          {type.name}
                        </div>
                      </SelectItem>
                    );
                  })
                ) : (
                  <SelectItem value="no-types" disabled>
                    No leave types available
                  </SelectItem>
                )}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label className="text-sm font-medium flex items-center">
              <Clock3Icon className="w-4 h-4 mr-2 text-gray-500" />
              Duration
            </Label>
            <div className="flex items-center gap-2 p-3 bg-gray-50 rounded-md border border-gray-200">
              <Clock3Icon className="h-4 w-4 text-gray-500" />
              <span className="font-medium text-sm">{calculateModalDays() || 0} day{calculateModalDays() !== 1 ? 's' : ''}</span>
            </div>
          </div>
        </div>

        {/* Reason */}
        <div className="space-y-2">
          <Label htmlFor="modalReason" className="text-sm font-medium flex items-center">
            <FileText className="w-4 h-4 mr-2 text-gray-500" />
            Reason for Leave *
          </Label>
          <Textarea
            id="modalReason"
            value={modalReason}
            onChange={(e) => setModalReason(e.target.value)}
            placeholder="Please provide a brief reason for your leave request..."
            rows={3}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
            required
          />
        </div>

        {/* Attachment Section */}
        <div className="space-y-2">
          <Label className="text-sm font-medium flex items-center">
            <Paperclip className="w-4 h-4 mr-2 text-gray-500" />
            Attachments (Optional)
          </Label>
          <div className="border border-gray-300 rounded-md p-3">
            <Input
              type="file"
              id="file-upload"
              className="hidden"
              onChange={handleFileChange}
              multiple
              // accept=".pdf,.doc,.docx,.jpg,.jpeg,.png" // Uncomment to restrict types
              disabled={isModalSubmitting}
            />
            <Label
              htmlFor="file-upload"
              className={`flex flex-col items-center justify-center w-full p-4 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors ${isModalSubmitting ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              <Upload className="w-6 h-6 text-gray-500 mb-2" />
              <span className="text-sm text-gray-600">Click to upload or drag and drop</span>
              <span className="text-xs text-gray-500 mt-1">Any file type up to 50MB</span>
            </Label>

            {/* Display upload error */}
            {uploadError && (
              <p className="text-red-500 text-xs mt-2">{uploadError}</p>
            )}

            {/* Display selected files */}
            {attachments.length > 0 && (
              <div className="mt-3 space-y-2">
                <p className="text-xs font-medium text-gray-700">Selected Files:</p>
                <ul className="space-y-1">
                  {attachments.map((file, index) => (
                    <li key={index} className="flex items-center justify-between text-sm bg-gray-50 p-2 rounded border">
                      <div className="flex items-center truncate">
                        <FileText className="w-4 h-4 mr-2 text-blue-500 flex-shrink-0" />
                        <span className="truncate">{file.name}</span>
                      </div>
                      <button
                        type="button"
                        onClick={() => removeAttachment(file)}
                        className="text-gray-500 hover:text-red-500 ml-2"
                        disabled={isModalSubmitting}
                        aria-label={`Remove ${file.name}`}
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>

        {/* Dialog Footer with Submit Button */}
        <DialogFooter className="pt-4">
          <DialogClose asChild>
            <Button type="button" variant="outline" disabled={isModalSubmitting}>
              Cancel
            </Button>
          </DialogClose>
          <Button
            type="submit"
            disabled={
              isModalSubmitting ||
              !availableLeaveTypes ||
              availableLeaveTypes.length === 0 ||
              !pendingStatusId
            }
          >
            {isModalSubmitting ? (
              <>
                <Clock3Icon className="mr-2 h-4 w-4 animate-spin" />
                Submitting...
              </>
            ) : (
              <>
                <Send className="mr-2 h-4 w-4" />
                Submit Request
              </>
            )}
          </Button>
        </DialogFooter>
      </form>
    </>
  );
};

export default NewRequestModalContent;
