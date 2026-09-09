import { expect, testStep } from '../../common/pwHelpers/pw';

export class HomePage {
  constructor(page, userId = 0) {
    this.page = page;
    this.userId = userId;
    this.yourFeedTab = page.getByText('Your Feed');
    this.newArticleLink = page.getByRole('link', { name: 'New Article' });
  }

  async step(title, stepToRun) {
    return await testStep(title, stepToRun, this.userId);
  }

  getArticleInYourFeed(articleTitle) {
    return this.page.getByText(`Article title: ${articleTitle}`);
  }

  async open() {
    await this.step(`Open Home page`, async () => {
      await this.page.goto('/', { waitUntil: 'domcontentloaded' });
      await this.page
        .locator('.loading-spinner')
        .waitFor({ state: 'hidden', timeout: 2000 });
    });
  }

  async clickNewArticleLink() {
    await this.step(`Click the 'New Article' link`, async () => {
      await this.newArticleLink.click();
    });
  }

  async assertYourFeedTabIsVisible() {
    await this.step(`Assert the 'Your Feed' tab is visible`, async () => {
      await expect(this.yourFeedTab).toBeVisible();
    });
  }

  async assertArticlesInYourFeedIsVisible(...articleTitle) {
    const titles = articleTitle.flat();
    await this.step(
      `
        Assert the article(s) [${titles.join(', ')}] are visible in 'Your Feed'`,
      async () => {
        for (const title of titles) {
          await expect(this.getArticleInYourFeed(title)).toBeVisible();
        }
      },
    );
  }
}
