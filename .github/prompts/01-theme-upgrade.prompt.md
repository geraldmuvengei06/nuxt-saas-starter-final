**🎨 MAJOR UPGRADE: Nuxt UI v3.1.3 + Tailwind 4 + Global Theming System**

I need to upgrade my Nuxt 3 SaaS Starter Kit from `@nuxt/ui": "^2.22.0"` to `@nuxt/ui": "^3.1.3"` with Tailwind 4, and implement a cohesive global theming system. This is a comprehensive upgrade that affects the entire UI architecture.
d

## **UPGRADE REQUIREMENTS:**

### **1. Package & Configuration Updates**

- Upgrade `@nuxt/ui` from `^2.22.0` to `^3.1.3`
- Upgrade to Tailwind CSS 4.x
- Update nuxt.config.ts to use Nuxt UI v3 configuration syntax
- Ensure compatibility with existing modules: `@nuxtjs/supabase`, `@nuxtjs/i18n`, `@pinia/nuxt`

### **2. Component Migration (CRITICAL)**

**Problem:** The project currently uses Nuxt UI v2 components that have different APIs in v3.

**Required Actions:**

- Audit ALL components across pages, layouts, and components directories
- Update component props, slots, and event handlers to match Nuxt UI v3 API
- Replace deprecated v2 components with their v3 equivalents
- Update form components (UInput, UButton, USelect, etc.) to use new v3 syntax
- Fix any breaking changes in navigation components (UDropdown, UModal, etc.)

### **3. Global Theming System Implementation**

**Current Problem:** Inline color/background classes scattered throughout components like:

```vue
class="bg-gray-50 text-gray-900 dark:bg-gray-900 dark:text-white"
```

**Required Solution:**

- Create a centralized theme configuration system
- Implement semantic color tokens that work with both light/dark modes
- Replace ALL inline color classes with semantic theme classes
- Ensure consistent theming across authentication pages, dashboard, and all UI components
- Create a theme composable for dynamic theme switching

### **4. Specific Files Requiring Updates:**

- default.vue - Navigation and global layout theming
- auth.vue - Authentication layout consistency
- dashboard.vue - Dashboard theming
- All authentication pages (`login.vue`, `register.vue`, `forgot-password.vue`, etc.)
- All dashboard pages and components
- Custom UI components in ui

### **5. Implementation Strategy:**

1. **Phase 1:** Update package.json and nuxt.config.ts
2. **Phase 2:** Create global theme configuration
3. **Phase 3:** Systematically update components starting with layouts
4. **Phase 4:** Update all pages to use semantic theme classes
5. **Phase 5:** Test theme switching and ensure consistency

### **6. Technical Requirements:**

- Maintain TypeScript compatibility throughout
- Preserve existing functionality while upgrading UI
- Ensure responsive design remains intact
- Maintain accessibility standards
- Follow the project's coding standards (see copilot-instructions.md)

### **7. Expected Deliverables:**

- Updated package.json with correct versions
- Updated nuxt.config.ts with v3 configuration
- Global theme configuration files
- All components updated to Nuxt UI v3 syntax
- Consistent semantic theming across entire application
- Theme switching functionality
- Documentation of breaking changes and migration steps

**Please provide a step-by-step implementation plan with code examples for each phase, focusing on maintaining the existing architecture while implementing these upgrades.**

---

This prompt should give GitHub Copilot Chat a comprehensive understanding of your upgrade needs and generate a detailed implementation plan with specific code examples for each component of the upgrade.
