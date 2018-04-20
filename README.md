# React uForms

Simple and elegant forms for your React application. React uForms based on new [Context API](https://reactjs.org/docs/context.html) (React v16.3 or higher).

### Installation
Using Yarn
```bash
yarn add react-uforms
```

Or NPM

```bash
npm install react-uforms --save
```
## Usage

### 1. Basic example
```jsx
import { Form } from 'react-uforms'

// ...

```
### 2. Validation
```jsx
import { Form } from 'react-uforms'

// ...

```

### 3. Prefiled form
```jsx
import { Form } from 'react-uforms'

// ...

```

### 4. Custom validator
```jsx
import { Form } from 'react-uforms'

// ...

```

### 5. Advanced form with Bootsrap 4
```jsx
import { Form } from 'react-uforms'

// ...

<Form
  values={{
    id: 1,
    email: 'foo.bar@example.com',
    username: 'foobar',
    profile: {
      firstName: 'Foo',
      lastName: 'Bar',
      sex: 'male',
      bio: 'void, define'
    },
    address: {
      country: 'US',
      state: null,
      city: 'Seattle',
      address: '12 Long Ave',
      address2: null,
      zip: '98121',
    },
    newsletter: {
      daily: true,
      weekly: 0,
    },
  }}
  onSubmit={(values) => {
     // ...
  }}
  onError={(errors) => {
    // ...
  }}
  validation={({ getValue }) => {
    return {
      email: [
        Validator.Required(),
        Validator.Email(),
      ],
      profile: {
        firstName: [
          Validator.Required(),
          Validator.MinLength(2),
          Validator.MaxLength(32),
        ],
        lastName: [
          Validator.Required(),
          Validator.MinLength(2),
          Validator.MaxLength(32),
        ],
        sex: [
          Validator.Required(),
          Validator.Range(['male', 'female']),
        ],
        bio: [
          Validator.MaxLength(200),
        ],
      },
      address: {
        country: [
          Validator.Required(),
          Validator.Range(['US', 'UK']),
        ],
        state: [
          ...(getValue('address.country') === 'US' ? [Validator.Required()] : []),
          Validator.MaxLength(30),
        ],
        city: [
          Validator.Required(),
          Validator.MaxLength(30),
        ],
        address: [
          Validator.Required(),
          Validator.MaxLength(60),
        ],
        address2: [
          Validator.MaxLength(60),
        ],
      },
    };
  }}
>
  {({ getValue }) => (
    <div className="row">
      <div className="col-md-6 mb-3">
        <label htmlFor="email">Email</label>
        <Text name="email" className="form-control" id="email" />
      </div>
    </div>

    <div className="row">
      <div className="col-md-6 mb-3">
        <label htmlFor="profile.firstName">First name</label>
        <Text name="profile.firstName" className="form-control" id="firstName" />
      </div>
      <div className="col-md-6 mb-3">
        <label htmlFor="profile.lastName">Last name</label>
        <Text name="profile.lastName" className="form-control" id="lastName" />
      </div>
    </div>

    <div className="row">
      <div className="col-md-12 mb-3">
        <div className="custom-control custom-radio custom-control-inline">
          <Radio name="profile.sex" value="male" type="radio" id="male" className="custom-control-input" />
          <label className="custom-control-label" htmlFor="male">Male</label>
        </div>
        <div className="custom-control custom-radio custom-control-inline">
          <Radio name="profile.sex" value="female" type="radio" id="female" className="custom-control-input" />
          <label className="custom-control-label" htmlFor="female">Female</label>
        </div>
        <FieldError name="profile.sex" />
      </div>
    </div>

    <div className="row">
      <div className="col-md-12 mb-3">
        <label htmlFor="bio">Bio</label>
        <TextArea name="profile.bio" className="form-control" id="bio" />
      </div>
    </div>

    <hr className="mb-4" />

    <h4 className="mb-3">Address</h4>

    <div className="row">
      <div className="col-md-12 mb-3">
        <label htmlFor="address">Address</label>
        <Text name="address.address" className="form-control" id="address" />
      </div>
    </div>

    <div className="row">
      <div className="col-md-12 mb-3">
        <label htmlFor="address2">Address 2 (optional)</label>
        <Text name="address.address2" className="form-control" id="address2" />
      </div>
    </div>

    <div className="row">
      <div className="col-md-5 mb-3">
        <label htmlFor="country">Country</label>
        <Select name="address.country" className="custom-select d-block w-100" id="country" options={[
          { value: 'US', name: 'United States' },
          { value: 'UK', name: 'United Kingdom' },
          { value: 'CA', name: 'Canada', disabled: true },
        ]} />
      </div>
    </div>

    <div className="row">
      <div className="col-md-5 mb-3">
        <label htmlFor="city">City</label>
        <Text name="address.city" type="text" className="form-control" id="city" />
      </div>
      {getValue('address.country') === 'US' && <div className="col-md-4 mb-3">
        <label htmlFor="state">State</label>
        <Select name="address.state" className="custom-select d-block w-100" id="state" options={[
          { value: '', name: 'Select state' },
          { value: 'CA', name: 'California' },
          { value: 'WA', name: 'Washington' },
        ]} />
      </div>}
      <div className="col-md-3 mb-3">
        <label htmlFor="zip">Zip</label>
        <Text name="address.zip" type="text" className="form-control" id="zip" />
      </div>
    </div>

    <hr className="mb-4" />

    <h4 className="mb-3">Newsletter</h4>

    <div className="custom-control custom-checkbox">
      <Checkbox name="newsletter.daily" onValue={true} offValue={false} className="custom-control-input" id="newsletter.daily" />
      <label className="custom-control-label" htmlFor="newsletter.daily">Daily updates</label>
    </div>
    <div className="custom-control custom-checkbox">
      <Checkbox name="newsletter.weekly" onValue={1} offValue={0} className="custom-control-input" id="newsletter.weekly" />
      <label className="custom-control-label" htmlFor="newsletter.weekly">Weekly updates</label>
    </div>

    <hr className="mb-4" />

    <button className="btn btn-primary btn-lg btn-block" type="submit">Save</button>
  )}
</Form>

// ...
```

## Authors

* **Bohdan Protsiuk** - [summerua](https://github.com/summerua)

## License

MIT License - see the [LICENSE.md](LICENSE.md) file for details
