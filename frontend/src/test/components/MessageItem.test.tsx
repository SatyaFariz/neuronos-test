import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import MessageItem from '../../components/MessageItem'; // adjust the import path as necessary
import { Message } from '../../types'; // adjust the import path as necessary

describe('MessageItem', () => {
  const mockMarkAsRead = vi.fn();

  const baseMessage: Message = {
    id: '1',
    incrementId: 1,
    content: 'Test message',
    timestamp: '2023-05-01T12:00:00Z',
    priority: 'medium',
    read: false,
  };

  it('renders the message content', () => {
    render(<MessageItem msg={baseMessage} markAsRead={mockMarkAsRead} />);
    expect(screen.getByText('Test message')).toBeInTheDocument();
  });

  it('renders the formatted timestamp', () => {
    render(<MessageItem msg={baseMessage} markAsRead={mockMarkAsRead} />);
    // Note: The exact string may vary based on the user's locale
    expect(screen.getByText(/5\/1\/2023/)).toBeInTheDocument();
  });

  it('applies the correct background color class based on priority', () => {
    const { container } = render(<MessageItem msg={baseMessage} markAsRead={mockMarkAsRead} />);
    const priorityIndicator = container.querySelector('.bg-info');
    expect(priorityIndicator).toBeInTheDocument();
  });

  it('shows "Mark as read" button for unread messages', () => {
    render(<MessageItem msg={baseMessage} markAsRead={mockMarkAsRead} />);
    expect(screen.getByText('Mark as read')).toBeInTheDocument();
  });

  it('hides "Mark as read" button for read messages', () => {
    const readMessage = { ...baseMessage, read: true };
    render(<MessageItem msg={readMessage} markAsRead={mockMarkAsRead} />);
    expect(screen.queryByText('Mark as read')).not.toBeInTheDocument();
  });

  it('calls markAsRead function when "Mark as read" is clicked', () => {
    render(<MessageItem msg={baseMessage} markAsRead={mockMarkAsRead} />);
    fireEvent.click(screen.getByText('Mark as read'));
    expect(mockMarkAsRead).toHaveBeenCalledWith('1');
  });

  it('applies different background colors for different priorities', () => {
    const priorities: ('high' | 'medium' | 'low')[] = ['high', 'medium', 'low'];
    const expectedClasses = ['bg-error', 'bg-info', 'bg-success'];

    priorities.forEach((priority, index) => {
      const message = { ...baseMessage, priority };
      const { container } = render(<MessageItem msg={message} markAsRead={mockMarkAsRead} />);
      const priorityIndicator = container.querySelector(`.${expectedClasses[index]}`);
      expect(priorityIndicator).toBeInTheDocument();
    });
  });
});