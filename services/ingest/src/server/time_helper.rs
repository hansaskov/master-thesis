use prost_types::Timestamp;
use time::{Duration, OffsetDateTime};

pub fn to_offset_date_time(timestamp: &Timestamp) -> OffsetDateTime {
    OffsetDateTime::UNIX_EPOCH
        + Duration::seconds(timestamp.seconds)
        + Duration::nanoseconds(timestamp.nanos as i64)
}
