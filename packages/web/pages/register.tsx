import * as React from "react";
import { Button, Form } from "semantic-ui-react";
import { Formik, Field } from "formik";
import { validUserSchema } from "@homeaider/common";
import { Mutation } from "react-apollo";
import Router from "next/router";

import { InputField } from "../components/formik-fields/InputField";
import { ErrorMessage } from "../components/ErrorMessage";
import { normalizeErrors } from "../utils/normalizeErrors";
import { registerMutation } from "../graphql/user/mutations/register";
import {
  RegisterMutation,
  RegisterVariables,
} from "../components/apollo-components";
import Layout from "../components/Layout";
import { render } from "react-dom";

interface FormValues {
  email: string;
  firstName: string;
  lastName: string;
  mobile: string;
  role: string;
  password: string;
}

interface Props {
  role: string;
}

export default class Register extends React.PureComponent<Props> {
  static async getInitialProps({ query: { role } }) {
    return {
      role,
    };
  }

  render() {
    const { role } = this.props;
    return (
      <Layout title="register">
        <Mutation<RegisterMutation, RegisterVariables>
          mutation={registerMutation}
        >
          {mutate => (
            <Formik<FormValues>
              initialValues={{
                email: "",
                firstName: "",
                lastName: "",
                mobile: "",
                role,
                password: "",
              }}
              onSubmit={async (
                { role, ...newInput },
                { setErrors, setSubmitting }
              ) => {
                const response = await mutate({
                  variables: { role, input: newInput },
                });

                if (
                  response &&
                  response.data &&
                  response.data.register.errors &&
                  response.data.register.errors.length
                ) {
                  setSubmitting(false);
                  return setErrors(
                    normalizeErrors(response.data.register.errors)
                  );
                } else {
                  Router.push("/login");
                }
              }}
              validationSchema={validUserSchema}
              validateOnBlur={false}
              validateOnChange={false}
            >
              {({ errors, handleSubmit, isSubmitting }) => (
                <Form onSubmit={handleSubmit}>
                  <Field
                    name="email"
                    label="Email"
                    placeholder="Email"
                    component={InputField}
                  />
                  <Field
                    name="firstName"
                    label="First Name"
                    component={InputField}
                  />
                  <Field
                    name="lastName"
                    label="Last Name"
                    component={InputField}
                  />
                  <Field
                    name="mobile"
                    label="Mobile"
                    placeholder="+639*******"
                    component={InputField}
                  />
                  <Field
                    name="password"
                    label="Password"
                    placeholder="Password"
                    component={InputField}
                    type="password"
                  />
                  <ErrorMessage errors={errors} />
                  <Button disabled={isSubmitting} type="submit">
                    Create Account
                  </Button>
                </Form>
              )}
            </Formik>
          )}
        </Mutation>
      </Layout>
    );
  }
}