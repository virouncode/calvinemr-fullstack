import * as yup from "yup";

export const staffSchema = yup.object({
  email: yup
    .string()
    .email("Invalid Email field")
    .required("Email field is required"),
  first_name: yup
    .string()
    .required("First Name field is required")
    .matches(/^([^0-9]*)$/, {
      message: "Invalid First Name",
      excludeEmptyString: true,
    }),
  middle_name: yup.string().matches(/^([^0-9]*)$/, {
    message: "Invalid Middle Name",
    excludeEmptyString: true,
  }),
  last_name: yup
    .string()
    .required("Last Name field is required")
    .matches(/^([^0-9]*)$/, {
      message: "Invalid Last Name",
      excludeEmptyString: true,
    }),
  speciality: yup.string().matches(/^([^0-9]*)$/, {
    message: "Invalid Speciality field",
    excludeEmptyString: true,
  }),
  subspeciality: yup.string().matches(/^([^0-9]*)$/, {
    message: "Invalid Subspeciality field",
    excludeEmptyString: true,
  }),
  cell_phone: yup
    .string()
    .required("Cell Phone field is required")
    .matches(/^\d{3}-\d{3}-\d{4}$/, {
      message: "Invalid Cell Phone number: XXX-XXX-XXXX format required",
      excludeEmptyString: true,
    }),
  backup_phone: yup.string().matches(/^\d{3}-\d{3}-\d{4}$/, {
    message: "Invalid Backup Phone number: XXX-XXX-XXXX format required",
    excludeEmptyString: true,
  }),
  video_link: yup
    .string()
    .matches(
      /^https?:\/\/(?:www\.)?[-a-zA-Z0-9@:%._+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b(?:[-a-zA-Z0-9()@:%_+.~#?&/=]*)$/,
      {
        message:
          "Invalid video link URL (your URL must start with http or https",
        excludeEmptyString: true,
      }
    ),
  ohip_billing_nbr: yup.string().matches(/^\d{6}$/, {
    message: "Invalid OHIP#, must be 6 digits",
    excludeEmptyString: true,
  }),
});
