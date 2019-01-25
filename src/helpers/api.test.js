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
    jest.mock("createPerson", () => jest.fn());

    const createPersonMock = jest.fn();
    // createPerson = createPersonMock
    await createPersonMock(createPerson, {
      name: "Seg un",
      email: "sege@mail.com"
    });

    expect(createPerson).toBeCalledWith(
      expect.objectContaining({
        name: expect.any(String),
        email: expect.any(String)
      })
    );
  });
});
