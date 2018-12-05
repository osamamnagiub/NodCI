const Page = require("./helpers/page");

let page;

beforeEach(async () => {
  page = await Page.build();

  await page.goto("http://localhost:3000");
});

afterEach(async () => {
  await page.close();
});

it("should start a new browser", async () => {
  const text = await page.getContentsOf("a.brand-logo");
  expect(text).toContain("Blogster");
});

test("clicking the login with google button", async () => {
  await page.waitFor(".right a");
  await page.click(".right a");
  const url = await page.url();

  expect(url).toMatch("/accounts.google.com/");
});

test("When signed in , show the logout button", async () => {
  await page.login();

  var content = await page.getContentsOf('a[href="/auth/logout"]');
  expect(content).toMatch("Logout");
});
