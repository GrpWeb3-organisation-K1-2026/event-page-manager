"use client";

/**
 * AdminApp.tsx
 * Full react-admin application embedded in the Next.js admin section.
 * Used for CRUD operations on Events, Sessions, Speakers, Rooms, Questions.
 *
 * Usage: import this in a dedicated route, e.g. /admin/crud/[[...slug]]/page.tsx
 */

import {
  Admin,
  Resource,
  List,
  Datagrid,
  TextField,
  DateField,
  NumberField,
  EditButton,
  DeleteButton,
  Edit,
  Create,
  SimpleForm,
  TextInput,
  DateTimeInput,
  NumberInput,
  ReferenceInput,
  SelectInput,
  ReferenceArrayInput,
  SelectArrayInput,
  Show,
  SimpleShowLayout,
  ReferenceField,
  ReferenceManyField,
  BooleanField,
  required,
  minLength,
  minValue,
} from "react-admin";
import { dataProvider } from "../lib/dataProvider";

const EventList = () => (
  <List perPage={25} sort={{ field: "startDate", order: "DESC" }}>
    <Datagrid rowClick="edit">
      <TextField source="id" />
      <TextField source="title" />
      <TextField source="place" />
      <DateField source="startDate" showTime />
      <DateField source="endDate" showTime />
      <NumberField source="_count.sessions" label="Sessions" />
      <EditButton />
      <DeleteButton />
    </Datagrid>
  </List>
);

const EventForm = () => (
  <SimpleForm>
    <TextInput source="title" validate={[required(), minLength(3)]} fullWidth />
    <TextInput source="description" multiline rows={4} fullWidth />
    <TextInput source="place" validate={required()} fullWidth />
    <DateTimeInput source="startDate" validate={required()} />
    <DateTimeInput source="endDate" validate={required()} />
  </SimpleForm>
);

const EventEdit = () => (
  <Edit>
    <EventForm />
  </Edit>
);

const EventCreate = () => (
  <Create>
    <EventForm />
  </Create>
);

const RoomList = () => (
  <List perPage={25}>
    <Datagrid rowClick="edit">
      <TextField source="id" />
      <TextField source="name" />
      <EditButton />
      <DeleteButton />
    </Datagrid>
  </List>
);

const RoomForm = () => (
  <SimpleForm>
    <TextInput source="name" validate={[required(), minLength(2)]} fullWidth />
  </SimpleForm>
);

const RoomEdit = () => (
  <Edit>
    <RoomForm />
  </Edit>
);
const RoomCreate = () => (
  <Create>
    <RoomForm />
  </Create>
);

const SpeakerList = () => (
  <List perPage={25}>
    <Datagrid rowClick="edit">
      <TextField source="id" />
      <TextField source="fullName" />
      <TextField source="biography" />
      <TextField source="photo" label="Photo URL" />
      <EditButton />
      <DeleteButton />
    </Datagrid>
  </List>
);

const SpeakerForm = () => (
  <SimpleForm>
    <TextInput source="fullName" validate={[required(), minLength(2)]} fullWidth />
    <TextInput source="biography" multiline rows={4} fullWidth />
    <TextInput source="photo" label="Photo URL" fullWidth />
  </SimpleForm>
);

const SpeakerEdit = () => (
  <Edit>
    <SpeakerForm />
  </Edit>
);
const SpeakerCreate = () => (
  <Create>
    <SpeakerForm />
  </Create>
);

const SessionList = () => (
  <List perPage={25} sort={{ field: "startDate", order: "ASC" }}>
    <Datagrid rowClick="edit">
      <TextField source="id" />
      <TextField source="title" />
      <ReferenceField source="eventId" reference="events" link={false}>
        <TextField source="title" />
      </ReferenceField>
      <ReferenceField source="roomId" reference="rooms" link={false}>
        <TextField source="name" />
      </ReferenceField>
      <DateField source="startDate" showTime />
      <DateField source="endDate" showTime />
      <NumberField source="capacity" />
      <EditButton />
      <DeleteButton />
    </Datagrid>
  </List>
);

const SessionForm = () => (
  <SimpleForm>
    <TextInput source="title" validate={[required(), minLength(3)]} fullWidth />
    <TextInput source="description" multiline rows={4} fullWidth />

    <ReferenceInput source="eventId" reference="events">
      <SelectInput optionText="title" validate={required()} fullWidth />
    </ReferenceInput>

    <ReferenceInput source="roomId" reference="rooms">
      <SelectInput optionText="name" validate={required()} fullWidth />
    </ReferenceInput>

    <DateTimeInput source="startDate" validate={required()} />
    <DateTimeInput source="endDate" validate={required()} />
    <NumberInput source="capacity" validate={[required(), minValue(1)]} />

    <ReferenceArrayInput source="speakerIds" reference="speakers" label="Speakers">
      <SelectArrayInput optionText="fullName" />
    </ReferenceArrayInput>
  </SimpleForm>
);

const SessionEdit = () => (
  <Edit>
    <SessionForm />
  </Edit>
);
const SessionCreate = () => (
  <Create>
    <SessionForm />
  </Create>
);

const SessionShow = () => (
  <Show>
    <SimpleShowLayout>
      <TextField source="id" />
      <TextField source="title" />
      <TextField source="description" />
      <ReferenceField source="eventId" reference="events">
        <TextField source="title" />
      </ReferenceField>
      <ReferenceField source="roomId" reference="rooms">
        <TextField source="name" />
      </ReferenceField>
      <DateField source="startDate" showTime />
      <DateField source="endDate" showTime />
      <NumberField source="capacity" />
      <ReferenceManyField reference="questions" target="sessionId" label="Questions">
        <Datagrid>
          <TextField source="content" />
          <TextField source="name" />
          <NumberField source="upvotes" />
          <DateField source="createdAt" showTime />
          <DeleteButton />
        </Datagrid>
      </ReferenceManyField>
    </SimpleShowLayout>
  </Show>
);

const QuestionList = () => (
  <List perPage={25} sort={{ field: "createdAt", order: "DESC" }}>
    <Datagrid rowClick="show">
      <TextField source="id" />
      <TextField source="content" />
      <TextField source="name" label="Author" />
      <NumberField source="upvotes" />
      <ReferenceField source="sessionId" reference="sessions" link={false}>
        <TextField source="title" />
      </ReferenceField>
      <DateField source="createdAt" showTime />
      <DeleteButton />
    </Datagrid>
  </List>
);

const QuestionShow = () => (
  <Show>
    <SimpleShowLayout>
      <TextField source="id" />
      <TextField source="content" />
      <TextField source="name" label="Author" />
      <NumberField source="upvotes" />
      <ReferenceField source="sessionId" reference="sessions">
        <TextField source="title" />
      </ReferenceField>
      <DateField source="createdAt" showTime />
    </SimpleShowLayout>
  </Show>
);

export default function AdminApp() {
  return (
    <Admin
      dataProvider={dataProvider}
      basename="/admin/crud"
      title="EventSync Admin"
      disableTelemetry
    >
      <Resource
        name="events"
        list={EventList}
        edit={EventEdit}
        create={EventCreate}
        recordRepresentation="title"
      />
      <Resource
        name="sessions"
        list={SessionList}
        edit={SessionEdit}
        create={SessionCreate}
        show={SessionShow}
        recordRepresentation="title"
      />
      <Resource
        name="speakers"
        list={SpeakerList}
        edit={SpeakerEdit}
        create={SpeakerCreate}
        recordRepresentation="fullName"
      />
      <Resource
        name="rooms"
        list={RoomList}
        edit={RoomEdit}
        create={RoomCreate}
        recordRepresentation="name"
      />
      <Resource
        name="questions"
        list={QuestionList}
        show={QuestionShow}
      />
    </Admin>
  );
}