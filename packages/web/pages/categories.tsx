import * as React from "react";
import { Table, Grid, Button, Icon } from "semantic-ui-react";
import Layout from "../components/Layout";
import { CategoriesComponent } from "../components/apollo-components";
import Loading from "../components/Loader";
import { CreateButton } from "../components/category/CreateButton";
import { UpdateButton } from "../components/category/UpdateButton";
import { DeleteButton } from "../components/category/DeleteButton";

interface State {
  modalOpen: boolean;
}

export default class PickRepo extends React.PureComponent<{}, State> {
  state = {
    modalOpen: false,
  };

  handleModalFormContainer = () => {
    console.log(this.state);
    this.setState({ modalOpen: !this.state.modalOpen });
  };

  render() {
    return (
      <Layout title="Categories" showMenu={true}>
        {/* @ts-ignore */}
        <CategoriesComponent>
          {({ data, loading, refetch }) => {
            if (loading) {
              return <Loading />;
            }

            return (
              <Grid columns={1} padded="vertically">
                <Grid.Column>
                  <CreateButton
                    modalOpen={this.state.modalOpen}
                    handleModalFormContainer={this.handleModalFormContainer}
                    refetch={refetch}
                  />
                </Grid.Column>
                <Grid.Column>
                  <Table fixed>
                    <Table.Header>
                      <Table.Row>
                        <Table.HeaderCell>Name</Table.HeaderCell>
                        <Table.HeaderCell>Description</Table.HeaderCell>
                        <Table.HeaderCell>Actions</Table.HeaderCell>
                      </Table.Row>
                    </Table.Header>

                    <Table.Body>
                      {data ? (
                        data.categories.map(item => (
                          <Table.Row key={item._id}>
                            <Table.Cell>{item.name}</Table.Cell>
                            <Table.Cell>{item.description}</Table.Cell>
                            <Table.Cell>
                              <DeleteButton
                                categoryId={item._id}
                                refetch={refetch}
                              />
                              <UpdateButton
                                item={item}
                                modalOpen={this.state.modalOpen}
                                handleModalFormContainer={
                                  this.handleModalFormContainer
                                }
                                refetch={refetch}
                              />
                            </Table.Cell>
                          </Table.Row>
                        ))
                      ) : (
                        <Table.Row>
                          <Table.HeaderCell />
                          <Table.HeaderCell>No Data</Table.HeaderCell>
                          <Table.HeaderCell />
                        </Table.Row>
                      )}
                    </Table.Body>
                  </Table>
                </Grid.Column>
              </Grid>
            );
          }}
        </CategoriesComponent>
      </Layout>
    );
  }
}