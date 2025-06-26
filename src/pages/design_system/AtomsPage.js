import React from 'react';
import {
  StyledContainer,
  StyledButton,
  StyledIcon,
  StyledBadge,
  StyledFormCheck, // Added
  StyledFormControl, // Added
  StyledFormLabel, // Added for context with form controls
  StyledLink, // Added
  StyledDivider, // Added
  designTokens, // For showing color values, etc.
  componentVariants // For listing variants
} from '../../components';
import styles from './AtomicPages.module.scss';

const AtomsPage = () => {
  const [textFieldValue, setTextFieldValue] = React.useState('');
  const [textAreaValue, setTextAreaValue] = React.useState('');
  const [checkboxChecked, setCheckboxChecked] = React.useState(true);
  const [radioValue, setRadioValue] = React.useState('option1');

  const availableButtonVariants = componentVariants.button || ['primary', 'secondary', 'success', 'danger', 'warning', 'info', 'light', 'dark', 'link', 'outline-primary'];
  const availableBadgeVariants = componentVariants.badge || ['primary', 'secondary', 'success', 'danger', 'warning', 'info', 'light', 'dark'];
  const commonSizes = ['sm', 'md', 'lg']; // Common sizes for demos

  return (
    <StyledContainer fluid className={styles.pageContainer}>
      <div className={styles.pageHeader}>
        <h1 className={styles.pageTitle}>Atoms</h1>
        <p>These are the basic building blocks of the UI, and cannot be broken down further without losing their meaning.</p>
      </div>

      {/* StyledButton Section */}
      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>StyledButton</h2>
        <p>Interactive element used for single-step actions.</p>

        <div className={styles.componentDemo}>
          <h3 className={styles.demoSubtitle}>Variants & Colors</h3>
          <div className={styles.demoArea}>
            {availableButtonVariants.map(variant => (
              <StyledButton key={variant} variant={variant} className={styles.demoElement}>
                {variant.charAt(0).toUpperCase() + variant.slice(1)}
              </StyledButton>
            ))}
          </div>
          <p className={styles.notes}>Note: Actual colors are defined by theme variables. The `variant` prop selects a predefined style (e.g., primary, secondary, link).</p>
        </div>

        <div className={styles.componentDemo}>
          <h3 className={styles.demoSubtitle}>Sizes (Illustrative via className - requires SCSS support)</h3>
          <div className={styles.demoArea}>
            <StyledButton variant="primary" className={`${styles.demoElement} ${styles.btnSizeSm}`}>Small (via class)</StyledButton>
            <StyledButton variant="primary" className={`${styles.demoElement} ${styles.btnSizeMd}`}>Medium (default/via class)</StyledButton>
            <StyledButton variant="primary" className={`${styles.demoElement} ${styles.btnSizeLg}`}>Large (via class)</StyledButton>
          </div>
          <p className={styles.notes}>Note: `StyledButton` does not have a direct `size` prop. Sizing can be controlled via utility CSS classes or specific styling in `StyledButton.module.scss`.</p>
        </div>

        <div className={styles.componentDemo}>
          <h3 className={styles.demoSubtitle}>Icon Support</h3>
          <div className={styles.demoArea}>
            <StyledButton variant="secondary" className={styles.demoElement}>
              <StyledIcon name="favorite" size="sm" className={styles.btnIconBefore} />
              With Icon Before
            </StyledButton>
            <StyledButton variant="secondary" className={styles.demoElement}>
              With Icon After
              <StyledIcon name="arrow_forward" size="sm" className={styles.btnIconAfter} />
            </StyledButton>
            <StyledButton variant="icon-secondary" aria-label="Search" className={styles.demoElement}> {/* icon-secondary is an example variant name */}
              <StyledIcon name="search" />
            </StyledButton>
          </div>
        </div>

        <div className={styles.componentDemo}>
          <h3 className={styles.demoSubtitle}>States</h3>
          <div className={styles.demoArea}>
            <StyledButton variant="primary" className={styles.demoElement}>Enabled</StyledButton>
            <StyledButton variant="primary" disabled className={styles.demoElement}>Disabled</StyledButton>
            <StyledButton variant="primary" href="#" className={styles.demoElement}>Link Button</StyledButton>
          </div>
          <p className={styles.notes}>Hover, active, and focus states are primarily CSS-driven. Loading state is not explicitly supported by `StyledButton` props.</p>
        </div>
      </section>

      {/* StyledIcon Section */}
      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>StyledIcon</h2>
        <p>Wrapper for SVG assets (Material Symbols) to control their appearance.</p>
        <div className={styles.componentDemo}>
          <h3 className={styles.demoSubtitle}>Names & Basic Usage</h3>
          <div className={styles.demoArea}>
            <StyledIcon name="home" className={styles.demoElement} title="Home Icon" />
            <StyledIcon name="settings" className={styles.demoElement} title="Settings Icon" />
            <StyledIcon name="search" className={styles.demoElement} title="Search Icon" />
            <StyledIcon name="favorite" className={styles.demoElement} title="Favorite Icon" />
            <StyledIcon name="delete" className={styles.demoElement} title="Delete Icon" />
          </div>
        </div>
        <div className={styles.componentDemo}>
          <h3 className={styles.demoSubtitle}>Sizes</h3>
          <div className={styles.demoArea}>
            <StyledIcon name="info" size="sm" className={styles.demoElement} title="Small Info Icon" />
            <StyledIcon name="info" size="md" className={styles.demoElement} title="Medium Info Icon" />
            <StyledIcon name="info" size="lg" className={styles.demoElement} title="Large Info Icon" />
            <StyledIcon name="info" size="xl" className={styles.demoElement} title="Extra Large Info Icon" />
            <StyledIcon name="info" size="3rem" className={styles.demoElement} title="Custom Size (3rem) Info Icon" />
          </div>
        </div>
        <div className={styles.componentDemo}>
          <h3 className={styles.demoSubtitle}>Colors (via prop or CSS)</h3>
          <div className={styles.demoArea}>
            <StyledIcon name="thumb_up" color={designTokens.colors.primary} className={styles.demoElement} title="Primary Color Thumb Up" />
            <StyledIcon name="thumb_up" color={designTokens.colors.success} className={styles.demoElement} title="Success Color Thumb Up" />
            <StyledIcon name="thumb_up" style={{ color: 'purple' }} className={styles.demoElement} title="Purple Thumb Up via style prop"/>
          </div>
          <p className={styles.notes}>Color can be set via the `color` prop or inherited/set via CSS.</p>
        </div>
        <div className={styles.componentDemo}>
          <h3 className={styles.demoSubtitle}>Interactivity (Example)</h3>
           <div className={styles.demoArea}>
            <StyledIcon name="refresh" onClick={() => alert('Refresh clicked!')} className={styles.demoElement} title="Refresh (Clickable)" />
          </div>
          <p className={styles.notes}>While `StyledIcon` can take an `onClick`, for proper accessibility (focus, keyboard nav), interactive icons should typically be wrapped in a `StyledButton` with an appropriate variant (e.g., `icon-secondary`).</p>
        </div>
      </section>

      {/* StyledBadge Section */}
      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>StyledBadge</h2>
        <p>Compact element representing status or labels.</p>
        <div className={styles.componentDemo}>
          <h3 className={styles.demoSubtitle}>Variants & Colors</h3>
          <div className={styles.demoArea}>
            {availableBadgeVariants.map(variant => (
              <StyledBadge key={variant} variant={variant} className={styles.demoElement}>
                {variant.charAt(0).toUpperCase() + variant.slice(1)}
              </StyledBadge>
            ))}
          </div>
        </div>
        <div className={styles.componentDemo}>
          <h3 className={styles.demoSubtitle}>Sizes</h3>
          <div className={styles.demoArea}>
            {commonSizes.map(size => (
              <StyledBadge key={size} variant="primary" size={size} className={styles.demoElement}>
                Size: {size.toUpperCase()}
              </StyledBadge>
            ))}
          </div>
        </div>
        <div className={styles.componentDemo}>
          <h3 className={styles.demoSubtitle}>Pill Shape</h3>
          <div className={styles.demoArea}>
            <StyledBadge variant="success" pill className={styles.demoElement}>
              Pill Badge
            </StyledBadge>
            <StyledBadge variant="warning" size="lg" pill className={styles.demoElement}>
              Large Pill
            </StyledBadge>
          </div>
        </div>
        <div className={styles.componentDemo}>
          <h3 className={styles.demoSubtitle}>With Icon (Illustrative)</h3>
          <div className={styles.demoArea}>
            <StyledBadge variant="info" className={styles.demoElement}>
              <StyledIcon name="info" size="sm" className={styles.badgeIconBefore}/>
              Info
            </StyledBadge>
             <StyledBadge variant="danger" pill className={styles.demoElement}>
              <StyledIcon name="warning" size="sm" className={styles.badgeIconBefore}/>
              Alert
            </StyledBadge>
          </div>
           <p className={styles.notes}>Icon support is achieved by passing an `StyledIcon` (or other element) as a child. Specific styling for icon placement within the badge might be needed.</p>
        </div>
      </section>

      {/* StyledFormCheck - Checkbox Section */}
      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>Checkbox (StyledFormCheck)</h2>
        <p>Form field used to select one or multiple values from a list.</p>
        <div className={styles.componentDemo}>
          <h3 className={styles.demoSubtitle}>Basic Checkboxes</h3>
          <div className={styles.demoArea} style={{ flexDirection: 'column', alignItems: 'flex-start' }}>
            <StyledFormCheck
              type="checkbox"
              id="checkbox-example-1"
              label="Default Checkbox"
              checked={checkboxChecked}
              onChange={() => setCheckboxChecked(!checkboxChecked)}
              className={styles.demoElement}
            />
            <StyledFormCheck
              type="checkbox"
              id="checkbox-example-2"
              label="Initially Unchecked"
              className={styles.demoElement}
            />
            <StyledFormCheck
              type="checkbox"
              id="checkbox-example-3"
              label="Disabled Checked Checkbox"
              checked
              disabled
              className={styles.demoElement}
            />
            <StyledFormCheck
              type="checkbox"
              id="checkbox-example-4"
              label="Disabled Unchecked Checkbox"
              disabled
              className={styles.demoElement}
            />
          </div>
          <p className={styles.notes}>Checklist items: Label, Checked state, Disabled state. Error state and Indeterminate state would require more complex setup or direct prop support in StyledFormCheck.</p>
        </div>
      </section>

      {/* StyledFormCheck - Radio Button Section */}
      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>Input Radio (StyledFormCheck)</h2>
        <p>Form field used for selecting one option from a list.</p>
        <div className={styles.componentDemo}>
          <h3 className={styles.demoSubtitle}>Radio Group</h3>
          <div className={styles.demoArea} style={{ flexDirection: 'column', alignItems: 'flex-start' }}>
            <StyledFormCheck
              type="radio"
              id="radio-example-1"
              name="exampleRadioGroup"
              label="Option 1"
              value="option1"
              checked={radioValue === 'option1'}
              onChange={(e) => setRadioValue(e.target.value)}
              className={styles.demoElement}
            />
            <StyledFormCheck
              type="radio"
              id="radio-example-2"
              name="exampleRadioGroup"
              label="Option 2"
              value="option2"
              checked={radioValue === 'option2'}
              onChange={(e) => setRadioValue(e.target.value)}
              className={styles.demoElement}
            />
            <StyledFormCheck
              type="radio"
              id="radio-example-3"
              name="exampleRadioGroup"
              label="Option 3 (Disabled)"
              value="option3"
              checked={radioValue === 'option3'}
              onChange={(e) => setRadioValue(e.target.value)}
              disabled
              className={styles.demoElement}
            />
          </div>
          <p className={styles.notes}>Current selection: {radioValue}</p>
          <p className={styles.notes}>Checklist items: Label, Checked state, Disabled state, Radio group. Error state would require more setup.</p>
        </div>
      </section>

      {/* StyledFormControl - Text Field Section */}
      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>Text Field (StyledFormControl)</h2>
        <p>Form field to enter and edit single-line text.</p>
        <div className={styles.componentDemo}>
          <h3 className={styles.demoSubtitle}>Basic Text Field</h3>
          <div className={styles.demoArea} style={{ flexDirection: 'column', alignItems: 'flex-start', width: '100%' }}>
            <StyledFormLabel htmlFor="text-field-example-1">Standard Text Field</StyledFormLabel>
            <StyledFormControl
              type="text"
              id="text-field-example-1"
              placeholder="Enter text here..."
              value={textFieldValue}
              onChange={(e) => setTextFieldValue(e.target.value)}
              className={styles.demoElement}
              style={{width: '50%'}}
            />
            <StyledFormLabel htmlFor="text-field-example-2" className="mt-2">Disabled Text Field</StyledFormLabel>
            <StyledFormControl
              type="text"
              id="text-field-example-2"
              placeholder="Cannot edit"
              disabled
              className={styles.demoElement}
              style={{width: '50%'}}
            />
            {/* Error state would typically be managed by a FormField molecule or parent state */}
          </div>
           <p className={styles.notes}>Checklist items: Label (via StyledFormLabel), Placeholder, Disabled state. Error state, Helper text, Icon/Prefix/Suffix, Sizes are often part of a molecule (like FormField) or require more direct styling/props.</p>
        </div>
      </section>

      {/* StyledFormControl - Text Area Section */}
      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>Text Area (StyledFormControl)</h2>
        <p>Form field to enter and edit multiline text.</p>
         <div className={styles.componentDemo}>
          <h3 className={styles.demoSubtitle}>Basic Text Area</h3>
          <div className={styles.demoArea} style={{ flexDirection: 'column', alignItems: 'flex-start', width: '100%' }}>
            <StyledFormLabel htmlFor="text-area-example-1">Standard Text Area</StyledFormLabel>
            <StyledFormControl
              as="textarea"
              id="text-area-example-1"
              rows={3}
              placeholder="Enter multiple lines of text..."
              value={textAreaValue}
              onChange={(e) => setTextAreaValue(e.target.value)}
              className={styles.demoElement}
              style={{width: '75%'}}
            />
            <StyledFormLabel htmlFor="text-area-example-2" className="mt-2">Disabled Text Area</StyledFormLabel>
            <StyledFormControl
              as="textarea"
              id="text-area-example-2"
              rows={3}
              placeholder="Cannot edit"
              disabled
              className={styles.demoElement}
              style={{width: '75%'}}
            />
          </div>
          <p className={styles.notes}>Checklist items: Label (via StyledFormLabel), Placeholder, Disabled state. Error state, Helper text, Sizes are often part of a molecule or require more direct styling/props.</p>
        </div>
      </section>

      {/* StyledLink Section */}
      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>StyledLink</h2>
        <p>Interactive text element for navigation.</p>
        <div className={styles.componentDemo}>
          <h3 className={styles.demoSubtitle}>Variants & States</h3>
          <div className={styles.demoArea}>
            <StyledLink href="#" className={styles.demoElement}>Default Link</StyledLink>
            <StyledLink to="/design/atoms" variant="subtle" className={styles.demoElement}>Subtle Router Link (to self)</StyledLink>
            <StyledLink href="#" variant="monochrome" className={styles.demoElement}>Monochrome Link</StyledLink>
            <StyledLink href="#" disabled className={styles.demoElement}>Disabled Link</StyledLink>
          </div>
          <p className={styles.notes}>Checklist items: Colors (via variants), Disabled state, Font inheritance (via monochrome/CSS), Accessibility role (auto via a/Link).</p>
        </div>
        <div className={styles.componentDemo}>
          <h3 className={styles.demoSubtitle}>With Icons (Illustrative)</h3>
          <div className={styles.demoArea}>
            <StyledLink href="#" className={styles.demoElement}>
              <StyledIcon name="open_in_new" size="sm" className={styles.btnIconAfter} /> External Link
            </StyledLink>
            <StyledLink to="/settings" className={styles.demoElement}>
              <StyledIcon name="settings" size="sm" className={styles.btnIconBefore} /> Settings Page
            </StyledLink>
          </div>
           <p className={styles.notes}>Icon support is by composing StyledIcon as a child.</p>
        </div>
      </section>

      {/* StyledDivider Section */}
      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>StyledDivider</h2>
        <p>Element for visual content separation.</p>
        <div className={styles.componentDemo}>
          <h3 className={styles.demoSubtitle}>Horizontal</h3>
          <p>Default Divider:</p>
          <StyledDivider className={styles.demoElement} />
          <p>Strong Divider:</p>
          <StyledDivider variant="strong" className={styles.demoElement} />
          <p>Dashed Divider:</p>
          <StyledDivider variant="dashed" className={styles.demoElement} />
        </div>
        <div className={styles.componentDemo}>
          <h3 className={styles.demoSubtitle}>Vertical (example in flex layout)</h3>
          <div className={styles.demoArea} style={{ height: '50px', alignItems: 'stretch' }}>
            <span>Item 1</span>
            <StyledDivider orientation="vertical" className={styles.demoElement}/>
            <span>Item 2</span>
            <StyledDivider orientation="vertical" variant="strong" className={styles.demoElement}/>
            <span>Item 3</span>
            <StyledDivider orientation="vertical" variant="dashed" className={styles.demoElement}/>
            <span>Item 4</span>
          </div>
          <p className={styles.notes}>Checklist items: Direction, Accessibility role (auto via hr).</p>
        </div>
      </section>

    </StyledContainer>
  );
};

export default AtomsPage;
