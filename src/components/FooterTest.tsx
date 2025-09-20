import React from 'react';
import { useApp } from '../App';
import EditableText from './EditableText';

const FooterTest: React.FC = () => {
  const { language, siteSettings, isEditMode, canEdit } = useApp();
  
  return (
    <div className="p-4 bg-gray-100 rounded-lg">
      <h2 className="text-xl font-bold mb-4">Footer Edit Test</h2>
      
      {isEditMode && canEdit() ? (
        <div className="bg-yellow-100 p-4 rounded-lg mb-4">
          <p className="text-yellow-800 font-medium">Edit Mode Active</p>
          <p className="text-yellow-700 text-sm">Click on any text below to edit</p>
        </div>
      ) : (
        <div className="bg-blue-100 p-4 rounded-lg mb-4">
          <p className="text-blue-800 font-medium">View Mode</p>
          <p className="text-blue-700 text-sm">Enable edit mode to make changes</p>
        </div>
      )}
      
      <div className="space-y-4">
        <div>
          <h3 className="font-semibold">Site Name:</h3>
          <EditableText
            path={`content.siteName.${language}`}
            value={siteSettings.content.siteName[language]}
            type="text"
            className="text-lg"
            placeholder="Site Name"
          >
            <p className="text-lg">{siteSettings.content.siteName[language]}</p>
          </EditableText>
        </div>
        
        <div>
          <h3 className="font-semibold">Footer Description:</h3>
          <EditableText
            path={`content.footer.description.${language}`}
            value={siteSettings.content.footer.description[language]}
            type="textarea"
            className="text-gray-700"
            placeholder="Footer description"
            multiline
          >
            <p className="text-gray-700">{siteSettings.content.footer.description[language]}</p>
          </EditableText>
        </div>
        
        <div>
          <h3 className="font-semibold">Contact Info:</h3>
          <div className="space-y-2">
            <EditableText
              path="content.contactInfo.address"
              value={siteSettings.content.contactInfo.address}
              type="textarea"
              className="text-gray-700"
              placeholder="Address"
              multiline
            >
              <p className="text-gray-700">{siteSettings.content.contactInfo.address}</p>
            </EditableText>
            
            <EditableText
              path="content.contactInfo.phone"
              value={siteSettings.content.contactInfo.phone}
              type="text"
              className="text-gray-700"
              placeholder="Phone"
            >
              <p className="text-gray-700">{siteSettings.content.contactInfo.phone}</p>
            </EditableText>
            
            <EditableText
              path="content.contactInfo.email"
              value={siteSettings.content.contactInfo.email}
              type="text"
              className="text-gray-700"
              placeholder="Email"
            >
              <p className="text-gray-700">{siteSettings.content.contactInfo.email}</p>
            </EditableText>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FooterTest;