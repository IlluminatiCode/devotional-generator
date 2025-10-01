import { render, screen, fireEvent } from '@testing-library/react';
import ThemeSelector from '@/components/ThemeSelector';

describe('ThemeSelector', () => {
  const mockOnThemeSelect = jest.fn();

  beforeEach(() => {
    mockOnThemeSelect.mockClear();
  });

  it('renders theme selection cards', () => {
    render(<ThemeSelector selectedTheme="" onThemeSelect={mockOnThemeSelect} />);

    expect(screen.getByText('Patience')).toBeInTheDocument();
    expect(screen.getByText('Forgiveness')).toBeInTheDocument();
    expect(screen.getByText('Hope')).toBeInTheDocument();
  });

  it('calls onThemeSelect when a theme is clicked', () => {
    render(<ThemeSelector selectedTheme="" onThemeSelect={mockOnThemeSelect} />);

    const patienceCard = screen.getByText('Patience').closest('div');
    if (patienceCard) {
      fireEvent.click(patienceCard);
      expect(mockOnThemeSelect).toHaveBeenCalledWith('Patience');
    }
  });

  it('highlights the selected theme', () => {
    render(<ThemeSelector selectedTheme="Hope" onThemeSelect={mockOnThemeSelect} />);

    const hopeCard = screen.getByText('Hope').closest('div');
    expect(hopeCard).toHaveClass('selected');
  });
});
