import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { MemoryRouter } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { ConfigProvider } from '../context/ConfigContext';
import { ConfigurePage } from '../pages/ConfigurePage';

// Mock localStorage
beforeEach(() => {
  localStorage.clear();
  vi.spyOn(Storage.prototype, 'getItem').mockReturnValue(null);
});

function renderApp() {
  return render(
    <MemoryRouter initialEntries={['/configure']}>
      <ConfigProvider>
        <Toaster />
        <ConfigurePage />
      </ConfigProvider>
    </MemoryRouter>
  );
}

describe('Dependency Rule 1: System Design disabled for Junior/Mid', () => {
  it('disables System Design button when Junior difficulty is selected', () => {
    renderApp();

    // Select Junior difficulty
    fireEvent.click(screen.getByRole('button', { name: /junior/i }));

    // Find the System Design button — it should be disabled
    const systemDesignBtn = screen.getByRole('button', { name: /system design/i });
    expect(systemDesignBtn).toBeDisabled();
  });

  it('disables System Design button when Mid difficulty is selected', () => {
    renderApp();

    fireEvent.click(screen.getByRole('button', { name: /^mid$/i }));

    const systemDesignBtn = screen.getByRole('button', { name: /system design/i });
    expect(systemDesignBtn).toBeDisabled();
  });

  it('enables System Design button when Senior difficulty is selected', () => {
    renderApp();

    fireEvent.click(screen.getByRole('button', { name: /senior/i }));

    const systemDesignBtn = screen.getByRole('button', { name: /system design/i });
    expect(systemDesignBtn).not.toBeDisabled();
  });

  it('enables System Design button when Lead difficulty is selected', () => {
    renderApp();

    fireEvent.click(screen.getByRole('button', { name: /^lead$/i }));

    const systemDesignBtn = screen.getByRole('button', { name: /system design/i });
    expect(systemDesignBtn).not.toBeDisabled();
  });
});
