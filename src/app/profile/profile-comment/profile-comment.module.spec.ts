import { ProfileCommentModule } from './profile-comment.module';

describe('ProfileCommentModule', () => {
  let profileCommentModule: ProfileCommentModule;

  beforeEach(() => {
    profileCommentModule = new ProfileCommentModule();
  });

  it('should create an instance', () => {
    expect(profileCommentModule).toBeTruthy();
  });
});
