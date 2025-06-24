import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { Actions } from './Actions';

// Базовый smoke-тест на рендер компонента и заголовок

describe('Actions component', () => {
  it('должен рендериться без ошибок и содержать заголовок', () => {
    render(<Actions />);
    expect(screen.getByRole('heading', { name: /акции и кампании/i })).toBeInTheDocument();
  });
});
