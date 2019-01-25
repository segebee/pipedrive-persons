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
// jest.mock("createPerson", () => jest.fn());

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

  it("returns an array list of a create person ", async () => {
    const createPersonMock = jest.fn(createPerson);
    await createPersonMock({
      name: "Segun Abisagbo",
      email: "sege@mail.com"
    });
    expect(createPersonMock).toEqual(expect.arrayContaining([]));
  });
});
