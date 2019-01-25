/**
 * @jest-environment node
 */
import {
  getAllPersons,
  getAllPersonFields,
  createPerson,
  getPerson,
  findPersons,
  storePersonOrder,
  deletePerson,
  createOrganization,
  getOrganizations,
  getAllOrganizations
} from "./api";

describe("API tests", () => {
  it("returns an array list of persons", async () => {
    expect(await getAllPersons()).toEqual(expect.arrayContaining([]));
  });

  it("returns an array list of person fields", async () => {
    expect(await getAllPersonFields()).toEqual(expect.arrayContaining([]));
  });

  it("checks if create person has the right parameters", async () => {
    const createPersonMock = jest.fn(createPerson);
    await createPersonMock({
      name: "Segun Abisagbo",
      email: "sege@mail.com"
    });

    expect(createPersonMock).toBeCalledWith(
      expect.objectContaining({
        name: expect.any(String),
        email: expect.any(String)
      })
    );
  });

  it("returns an array list after creating a person ", async () => {
    let a = await createPerson({
      name: "Segun Abisagbo",
      email: "sege@mail.com"
    });
    expect(a).toEqual(expect.arrayContaining([]));
  });

  it("gets a person when an id is supplied", async () => {
    expect(await getPerson(1)).toHaveProperty("id");
  });

  it("finds a person when a name is supplied", async () => {
    expect(await findPersons("segun")).toEqual(expect.arrayContaining([]));
  });

  it("stores person list order", async () => {
    const id = 1;
    const data = { order: 0 };
    expect(await storePersonOrder(id, data)).toEqual(
      expect.arrayContaining([])
    );
  });

  it("deletes a person", async () => {
    const id = 2;
    expect(await deletePerson(id)).toEqual(expect.arrayContaining([]));
  });

  it("creates an organization", async () => {
    const data = { name: "Test Company" };
    expect(await createOrganization(data)).toEqual(expect.arrayContaining([]));
  });

  it("gets an organization details", async () => {
    const name = "test";
    expect(await getOrganizations(name)).toEqual(expect.arrayContaining([]));
  });

  it("gets all organizations", async () => {
    expect(await getAllOrganizations()).toEqual(expect.arrayContaining([]));
  });
});
