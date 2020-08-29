import React, { Fragment, useEffect } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import Spinner from "../webparts/Spinner";
import ProfileList from "./ProfileList";
import { getProfiles } from "../../actions/profile";

const ProfilesPage = ({ getProfiles, profile: { profiles, loading } }) => {
  useEffect(() => {
    getProfiles();
  }, [getProfiles, loading]);
  return (
    <Fragment>
      {profiles === null || loading ? (
        <Spinner />
      ) : (
        <Fragment>
          <h1 className="large text-primary">Developers</h1>
          <p className="lead">
            <span>
              <i className="fab fa-connectdevelop"></i>Browse and connect
            </span>
          </p>
          <div className="profiles">
            {profiles.length > 0 ? (
              profiles.map((profile) => (
                <ProfileList key={profile._id} profile={profile} />
              ))
            ) : (
              <Fragment>There are no profiles to view</Fragment>
            )}
          </div>
        </Fragment>
      )}
    </Fragment>
  );
};

ProfilesPage.propTypes = {
  getProfiles: PropTypes.func.isRequired,
  profile: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => ({ profile: state.profile });

export default connect(mapStateToProps, { getProfiles })(ProfilesPage);
