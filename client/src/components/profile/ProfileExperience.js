import React, { Fragment } from "react";
import PropTypes from "prop-types";
import Moment from "react-moment";

const ProfileExperience = ({
  experience: { title, company, location, from, to, current, description },
}) => {
  return (
    <Fragment>
      <h3 className="text-dark">{company}</h3>
      <p>
        <em>
          <Moment format="YYYY/MM/DD">{from}</Moment> -{" "}
          {!to ? "present" : <Moment format="YYYY/MM/DD">{to}</Moment>}
        </em>
      </p>
      <p>
        <strong>Position: </strong>
        {title}
      </p>
      <p>
        <strong>Description:</strong>
        {description}
      </p>
    </Fragment>
  );
};

ProfileExperience.propTypes = { experience: PropTypes.array.isRequired };

export default ProfileExperience;
