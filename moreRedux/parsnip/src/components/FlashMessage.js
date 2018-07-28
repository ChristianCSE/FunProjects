
//while never referenced, it is still needed so 
//React object can be in scope
import React from 'react';


export const FlashMesssage = (props) => {
  return(
    <div className="flash-error"> 
      {props.message}
    </div>
  );
};

Error.defaultProps = {
  message: 'An error occured'
};