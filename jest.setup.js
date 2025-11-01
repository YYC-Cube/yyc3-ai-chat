
import '@testing-library/jest-dom';
import { render } from '@testing-library/react';

const AllTheProviders = ({ children }) => {
  return <I18nProvider>{children}</I18nProvider>;
};

const customRender = (ui, options) => render(ui, { wrapper: AllTheProviders, ...options });

// 每个测试前清理 localStorage，避免语言设置污染
beforeEach(() => {
  try {
    localStorage.clear();
  } catch {}
});

export * from '@testing-library/react';
export { customRender as render };
