import { SlippiVizPage } from './app.po';

describe('slippi-viz App', () => {
  let page: SlippiVizPage;

  beforeEach(() => {
    page = new SlippiVizPage();
  });

  it('should display welcome message', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('Welcome to app!!');
  });
});
