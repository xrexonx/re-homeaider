import * as React from "react";
import { Table, Grid, List } from "semantic-ui-react";
import Layout from "../components/Layout";
import { SubscriptionsComponent } from "../components/apollo-components";
import Loading from "../components/Loader";
import { CreateButton } from "../components/subscriptions/CreateButton";
import { UpdateButton } from "../components/subscriptions/UpdateButton";
import { DeleteButton } from "../components/subscriptions/DeleteButton";

export default class PickRepo extends React.PureComponent<{}> {
  render() {
    return (
      <Layout title="Subscriptions" showMenu={true}>
        {/* @ts-ignore */}
        <SubscriptionsComponent>
          {({ data, loading, refetch }) => {
            if (loading) {
              return <Loading />;
            }

            return (
              <Grid columns={1} padded="vertically">
                <Grid.Column>
                  <CreateButton refetch={refetch} />
                </Grid.Column>
                <Grid.Column>
                  <Table fixed>
                    <Table.Header>
                      <Table.Row>
                        <Table.HeaderCell>Name</Table.HeaderCell>
                        <Table.HeaderCell>Description</Table.HeaderCell>
                        <Table.HeaderCell>Benefits</Table.HeaderCell>
                        <Table.HeaderCell textAlign="right">
                          Amount
                        </Table.HeaderCell>
                        <Table.HeaderCell>Payment Mode</Table.HeaderCell>
                        <Table.HeaderCell>Actions</Table.HeaderCell>
                      </Table.Row>
                    </Table.Header>

                    <Table.Body>
                      {data ? (
                        data.subscriptions.map(item => (
                          <Table.Row key={item._id}>
                            <Table.Cell verticalAlign="top">
                              {item.name}
                            </Table.Cell>
                            <Table.Cell verticalAlign="top">
                              {item.description}
                            </Table.Cell>
                            <Table.Cell>
                              <List>
                                {item.benefits.map(ben => (
                                  <List.Item>{ben}</List.Item>
                                ))}
                              </List>
                            </Table.Cell>
                            <Table.Cell verticalAlign="top" textAlign="right">
                              {item.amount}
                            </Table.Cell>
                            <Table.Cell verticalAlign="top">
                              {item.paymentMode.toUpperCase()}
                            </Table.Cell>
                            <Table.Cell verticalAlign="top">
                              <DeleteButton
                                subscriptionId={item._id}
                                refetch={refetch}
                              />
                              <UpdateButton item={item} refetch={refetch} />
                            </Table.Cell>
                          </Table.Row>
                        ))
                      ) : (
                        <Table.Row>
                          <Table.HeaderCell>No Data</Table.HeaderCell>
                          <Table.HeaderCell />
                          <Table.HeaderCell />
                          <Table.HeaderCell />
                          <Table.HeaderCell />
                          <Table.HeaderCell />
                        </Table.Row>
                      )}
                    </Table.Body>
                  </Table>
                </Grid.Column>
              </Grid>
            );
          }}
        </SubscriptionsComponent>
      </Layout>
    );
  }
}
