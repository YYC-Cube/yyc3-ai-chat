import { act } from '@testing-library/react';

import { render } from '@/jest.setup';
import { useI18n } from '@/lib/i18n';

const TestComponent = () => {
  const { t, locale, setLocale } = useI18n();
  return (
    <div>
      <span data-testid="translation">{t('common.newChat')}</span>
      <span data-testid="locale">{locale}</span>
      <button onClick={() => setLocale('en-US')}>Switch</button>
    </div>
  );
};

describe('I18nProvider', () => {
  it('should provide translations', () => {
    const { getByTestId } = render(<TestComponent />);
    expect(getByTestId('translation').textContent).toBe('新建会话');
  });

  it('should switch locale', () => {
    const { getByTestId, getByText } = render(<TestComponent />);
    expect(getByTestId('locale').textContent).toBe('zh-CN');

    act(() => {
      getByText('Switch').click();
    });

    expect(getByTestId('locale').textContent).toBe('en-US');
  });

  it('should provide translations with vars', () => {
    const Temp = () => {
      const { tWithVars } = useI18n();
      return (
        <span data-testid="updated">{tWithVars?.('message.updatedAgo', { time: '5分钟' })}</span>
      );
    };
    const r = render(<Temp />);
    expect(r.getByTestId('updated').textContent).toBe('更新于 5分钟');
  });

  it('should support pluralization', () => {
    const Temp = () => {
      const { tPlural } = useI18n();
      return (
        <>
          <span data-testid="one">{tPlural?.('message.messages', 1)}</span>
          <span data-testid="many">{tPlural?.('message.messages', 5)}</span>
        </>
      );
    };
    const r = render(<Temp />);
    expect(r.getByTestId('one').textContent).toBe('条消息');
    expect(r.getByTestId('many').textContent).toBe('条消息');
  });
});
