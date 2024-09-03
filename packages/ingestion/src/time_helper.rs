use prost_types::Timestamp;
use std::time::SystemTime;
use time::{Duration, OffsetDateTime};

pub trait TimeHelper {
    fn to_offset_date_time(&self) -> OffsetDateTime;
    fn from_offset_date_time(dt: OffsetDateTime) -> Self;
    fn timestamp_now() -> Self;
}

impl TimeHelper for Timestamp {
    fn to_offset_date_time(&self) -> OffsetDateTime {
        OffsetDateTime::UNIX_EPOCH
            + Duration::seconds(self.seconds)
            + Duration::nanoseconds(self.nanos as i64)
    }

    fn from_offset_date_time(dt: OffsetDateTime) -> Self {
        let unix_time = dt - OffsetDateTime::UNIX_EPOCH;
        Self {
            seconds: unix_time.whole_seconds(),
            nanos: unix_time.subsec_nanoseconds(),
        }
    }

    fn timestamp_now() -> Self {
        prost_types::Timestamp::from(SystemTime::now())
    }
}
