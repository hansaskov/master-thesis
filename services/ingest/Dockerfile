#-------------------------------------------------------------------------------
# Build stage
#-------------------------------------------------------------------------------
FROM rust:1-alpine3.19 AS builder

# See: https://github.com/rust-lang/docker-rust/issues/85
ENV RUSTFLAGS="-C target-feature=-crt-static"

# Install build dependencies
RUN apk add --no-cache musl-dev libc-dev protobuf-dev

# Set the working directory
WORKDIR /app

# Copy source code over
COPY . .

# Build the server in release mode
RUN cargo build --bin server --release

# Minimize the binary size using strip
RUN strip target/release/server


#-------------------------------------------------------------------------------
# Runtime stage
#-------------------------------------------------------------------------------
FROM alpine:3.19 AS runtime

# Install necessary runtime dependencies
RUN apk add --no-cache libgcc

# Copy the binary from the build stage
COPY --from=builder /app/target/release/server /server

# Set the entry point to the server binary
ENTRYPOINT ["/server"]