export interface CalendlyResponse<T> {
  collection: T[];
  pagination: Pagination;
}

interface Pagination {
  count: number;
  next_page?: string;
  previous_page?: string;
  next_page_token?: string;
  previous_page_token?: string;
}

export interface EventType {
  uri: string;
  name: string;
  duration: number;
  slug?: string;
  scheduling_url: string;
  kind: "solo" | "group";
  color: string;
  created_at: string;
  updated_at: string;
  active: boolean;
  description_html?: string;
}

export interface ScheduledEventsResponse {
  collection: Array<{
    uri: string;
    name: string;
    meeting_notes_plain?: string;
    meeting_notes_html?: string;
    status: string;
    start_time: string;
    end_time: string;
    event_type: string;
    location: {
      type: string;
      location: string;
      additional_info?: string;
    };
    invitees_counter: {
      total: number;
      active: number;
      limit: number;
    };
    created_at: string;
    updated_at: string;
    event_memberships: Array<{
      user: string;
      user_email: string;
      user_name: string;
      buffered_end_time: string;
      buffered_start_time: string;
    }>;
    event_guests: Array<{
      email: string;
      created_at: string;
      updated_at: string;
    }>;
    calendar_event?: {
      kind: string;
      external_id: string;
    };
  }>;
  pagination: Pagination;
}
