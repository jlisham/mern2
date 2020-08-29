import React, { Fragment } from "react";
import PropTypes from "prop-types";

const ProfileAbout = ({
  profile: {
    bio,
    skills,
    user: { name },
  },
}) => {
  return (
    <div className="profile-about bg-light p-2">
      {bio && (
        <Fragment>
          <h2 className="text-primary">{name}'s Bio</h2>
          <p>{bio && { bio }}</p>
          <div className="line"></div>
        </Fragment>
      )}
      <h2 className="text-primary">Skill Set</h2>
      <div className="skills">
        {skills.slice(0, 4).map((skill, index) => (
          <div className="p-1">
            <span>
              <i className="fas fa-check"></i>
            </span>{" "}
            {skill}
          </div>
        ))}
      </div>
    </div>
  );
};

ProfileAbout.propTypes = { profile: PropTypes.object.isRequired };

export default ProfileAbout;
