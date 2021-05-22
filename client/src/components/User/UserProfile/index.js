import React from 'react';
import UserHome from '../../Hoc/UserHome';
import emailPassword from './emailPassword';

const Profile = (props) => {
  return (
    <UserHome>
      <emailPassword {...props} />
      <hr />
    </UserHome>
  );
};

export default Profile;
