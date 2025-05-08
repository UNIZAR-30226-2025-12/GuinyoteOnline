import React, { useState } from 'react';
import CommonButton from './base_buttons/CommonButton';
import signOutIcon from '/src/assets/signOutIcon.png';
import ConfirmLogoutModal from '../ConfirmLogoutModal';

function SignOutButton({ className, onClick}) {
  
  return (
    <>
      <CommonButton
        className={className}
        imagePath={signOutIcon}
        buttonText="Cerrar sesión"
        onClick={onClick} 
      />
      
    </>
  );
}

export default SignOutButton;
