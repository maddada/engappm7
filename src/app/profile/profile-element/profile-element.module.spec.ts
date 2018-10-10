import { ProfileElementModule } from './profile-element.module';

describe('ProfileElementModule', () => {
  let profileElementModule: ProfileElementModule;

  beforeEach(() => {
    profileElementModule = new ProfileElementModule();
  });

  it('should create an instance', () => {
    expect(profileElementModule).toBeTruthy();
  });
});
